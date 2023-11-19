import { getCrawler, getCrawlers, runCrawlers } from './lib/crawler'
import {
  downloadEvents,
  getRunKey,
  uploadEvents,
  uploadLogJson,
  uploadSummary,
} from './lib/transfer'
import { addLogfileTransport, LOG_FILE_PATH, logger } from './lib/logging'
import { Event } from '@wasgeit/common/src/types'
import { Command } from 'commander'
import './crawlers'

const program = new Command()
program
  .option(
    '--local',
    'do not upload any logs or other artifacts to the s3 bucket'
  )
  .parse()

const local = program.opts().local

if (local) {
  logger.info('not uploading any artifacts')
} else {
  addLogfileTransport(LOG_FILE_PATH)
}

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
    logger.info(`starting run ${runKey}`)
    const summary = await runCrawlers(getCrawlers())
    logger.info('all venues crawled')

    const newEvents = summary.successful.map(result => result.events).flat(1)

    if (newEvents.length === 0) {
      logger.info('crawling broken, no new events returned')
      return
    }

    if (summary.broken.length <= 0) {
      if (!local) {
        await uploadEvents(runKey, newEvents)
        logger.info(`${newEvents.length} new events uploaded`, {
          totalNumberOfEvents: newEvents.length,
        })
      }
    } else {
      logger.info(
        `broken crawlers: ${summary.broken.map(
          failure => `${failure.crawlerKey}: "${failure.error}"`
        )}`
      )

      const existingEventsOfBrokenCrawlers = await getExistingEventsFor(
        summary.broken.map(crawler => crawler.crawlerKey)
      )

      if (!local) {
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
    }

    if (!local) {
      await uploadSummary(runKey, summary)
    }
  } catch (error: any) {
    logger.error('main() failed', { error: error.message })
  } finally {
    if (!local) {
      await uploadLogJson(runKey ?? new Date().toISOString())
    }
  }
}

main()
