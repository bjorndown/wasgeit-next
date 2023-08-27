import { getCrawler, getCrawlers, runCrawlers } from './lib/crawler'
import { downloadEvents, uploadFile } from './lib/transfer'
import { logger } from './lib/logging'
import { Event } from '@wasgeit/common/src/types'

import './crawlers'
import { enableSlackTransport } from './lib/slack'

enableSlackTransport()

const getExistingEventsFor = async (
  crawlerKeys: string[]
): Promise<Event[]> => {
  const existingEvents = await downloadEvents()
  const brokenVenues = crawlerKeys.map(crawler => getCrawler(crawler).venue)
  logger.debug('downloaded existing events for broken crawlers', {
    totalExistingEvents: existingEvents.length,
    brokenCrawlers: crawlerKeys,
  })
  return existingEvents.filter(event => brokenVenues.includes(event.venue))
}

export const main = async () => {
  const summary = await runCrawlers(getCrawlers())
  logger.info('all venues crawled')

  const newEvents = summary.successful.map(result => result.events).flat(1)

  if (newEvents.length === 0) {
    logger.info('crawling broken, no new events returned')
    return
  }

  logger.debug('crawling summary', summary)

  if (summary.broken.length <= 0) {
    await uploadFile(newEvents)
    logger.info(`${newEvents.length} new events uploaded`, {
      totalNumberOfEvents: newEvents.length,
    })
  } else {
    logger.info(
      `broken crawlers: ${summary.broken.map(
        failure => `${failure.crawlerKey}: "${failure.error}"`
      )}`
    )

    const existingEventsOfBrokenCrawlers = await getExistingEventsFor(
      summary.broken.map(crawler => crawler.crawlerKey)
    )

    await uploadFile(newEvents.concat(existingEventsOfBrokenCrawlers))
    logger.info(
      `${newEvents.length} new and ${existingEventsOfBrokenCrawlers.length} existing events uploaded`,
      {
        totalNumberOfEvents: newEvents.length,
        newEvents: newEvents.length,
        existingEvents: existingEventsOfBrokenCrawlers.length,
      }
    )
  }

  for (const run of summary.successful) {
    if (run.broken.length > 0) {
      logger.info(
        `crawler "${run.key}" has ${
          run.broken.length
        } broken events: ${JSON.stringify(run.broken)}`
      )
    }
    if (run.ignored.length > 0) {
      logger.info(
        `crawler "${run.key}" ignored ${
          run.ignored.length
        } events: ${JSON.stringify(run.ignored)}`
      )
    }
  }
}

main()
