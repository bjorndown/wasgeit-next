import { getCrawler, getCrawlers, runCrawlers } from './lib/crawler'
import {
  downloadEvents,
  getRunKey,
  uploadEvents,
  uploadLogJson,
  uploadSummary,
} from './lib/transfer'
import { LOG_FILE_PATH, logger } from './lib/logging'
import { Event } from '@wasgeit/common/src/types'
import winston from 'winston'

import './crawlers'

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
  let runKey
  try {
    runKey = await getRunKey()

    const summary = await runCrawlers(getCrawlers())
    logger.info('all venues crawled')

    const newEvents = summary.successful.map(result => result.events).flat(1)

    if (newEvents.length === 0) {
      logger.info('crawling broken, no new events returned')
      return
    }

    if (summary.broken.length <= 0) {
      await uploadEvents(runKey, newEvents)
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

      await uploadEvents(
        runKey,
        newEvents.concat(existingEventsOfBrokenCrawlers)
      )
      logger.info(
        `${newEvents.length} new and ${existingEventsOfBrokenCrawlers.length} existing events uploaded`,
        {
          totalNumberOfEvents: newEvents.length,
          newEvents: newEvents.length,
          existingEvents: existingEventsOfBrokenCrawlers.length,
        }
      )
    }

    await uploadSummary(runKey, summary)
  } finally {
    await uploadLogJson(runKey ?? new Date().toISOString())
  }
}

main()
