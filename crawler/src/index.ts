import { runCrawlers } from './lib/crawler'
import crawlers from './crawlers'
import { uploadFile } from './lib/upload'
import { logger } from './lib/logging'
import { notifySlack } from './lib/slack'

export const crawlVenues = async () => {
  const events = await runCrawlers(crawlers)
  logger.info('venues crawled')

  if (events.length === 0) {
    await notifySlack('crawling broken, 0 events crawled')
    return
  }

  await uploadFile('events.json', JSON.stringify(events))

  await notifySlack(`crawling done, ${events.length} events found`)

  logger.info('events uploaded')
}
