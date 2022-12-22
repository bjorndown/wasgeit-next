import * as dotenv from 'dotenv'
dotenv.config()

import { logger } from './lib/logging'
import { Crawler, runCrawlers } from './lib/crawler'
import path from 'path'
import crawlers from './crawlers'

const getCrawlers = (): Promise<Crawler>[] => {
  if (!process.argv[2]) {
    return crawlers.map((crawler) => Promise.resolve(crawler))
  }

  const modulePath = path.join(__dirname, 'crawlers', process.argv[2])
  return [
    import(modulePath).then((module: { crawler: Crawler }) => module.crawler),
  ]
}

const main = async () => {
  try {
    const crawlers = await Promise.all(getCrawlers())
    console.dir(crawlers)
    const finalEvents = await runCrawlers(crawlers)
    console.log(finalEvents)
  } catch (error) {
    logger.error(error)
  }
}

main().catch((error) => logger.error(error))
