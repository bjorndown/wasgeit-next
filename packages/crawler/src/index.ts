import { getCrawler, getCrawlers, runCrawlers } from './lib/crawler'
import { downloadEvents, uploadEvents, uploadLogJson } from './lib/transfer'
import { LOG_FILE_PATH, logger } from './lib/logging'
import { Event } from '@wasgeit/common/src/types'

import './crawlers'
import { BUCKET_NAME, SPACE_NAME } from '@wasgeit/common/src/constants'
import winston from 'winston'

logger.add(new winston.transports.File({ filename: LOG_FILE_PATH }))

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
    await uploadEvents(newEvents)
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

    await uploadEvents(newEvents.concat(existingEventsOfBrokenCrawlers))
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

main().finally(() =>
  uploadLogJson(
    LOG_FILE_PATH,
    `${BUCKET_NAME}/logs/${new Date().toISOString()}.log`
  )
)
