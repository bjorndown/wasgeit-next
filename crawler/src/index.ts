import { runCrawlers } from './lib/crawler'
import crawlers from './crawlers'
import { uploadFile } from './lib/upload'
import { logger } from './lib/logging'

export const crawlVenues = async () => {
  const events = await runCrawlers(crawlers)
  logger.info('venues crawled')

  await uploadFile('events.json', JSON.stringify(events))
  logger.info('events uploaded')
}
