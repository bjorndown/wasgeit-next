import * as dotenv from 'dotenv'
dotenv.config()

import { logger } from './lib/logging'
import { getCrawler, runCrawlers } from './lib/crawler'

import './crawlers'

const main = async () => {
  try {
    const crawlers = getCrawler(process.argv[2])
    const finalEvents = await runCrawlers([crawlers])
    console.log(finalEvents)
  } catch (error: any) {
    logger.error(error.toString())
  }
}

main()
