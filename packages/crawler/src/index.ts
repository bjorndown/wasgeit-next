import { getCrawlers, runCrawlers } from './lib/crawler'
import { uploadFile } from './lib/upload'
import { logger } from './lib/logging'
import { notifySlack } from './lib/slack'

import './crawlers'

export const main = async () => {
  const results = await runCrawlers(getCrawlers())

  const events = results.successful.map(result => result.events).flat(1)

  logger.info('venues crawled')

  if (events.length === 0) {
    await notifySlack('crawling broken, no events returned')
    return
  }

  await uploadFile('events.json', JSON.stringify(events))

  logger.info('done', { totalNumberOfEvents: events.length })
  await notifySlack(`crawling done, ${events.length} events uploaded`)

  if (results.failed.length > 0) {
    logger.info('broken crawlers', { failed: results.failed })
    await notifySlack(
      `broken crawlers: ${results.failed.map(
        failure => `${failure.key}: "${failure.error}"`
      )}`
    )
  }

  for (const result of results.successful) {
    if (result.failed) {
      logger.info('broken event', { failed: result.failed })
      await notifySlack(
        `crawler "${result.key}" has ${
          result.failed.length
        } broken events: ${JSON.stringify(result.failed)}`
      )
    }
    if (result.ignored) {
      logger.info('ignored event', { ignored: result.ignored })
      await notifySlack(
        `crawler "${result.key}" ignored ${
          result.ignored.length
        } events: ${JSON.stringify(result.ignored)}`
      )
    }
  }
}

main()
