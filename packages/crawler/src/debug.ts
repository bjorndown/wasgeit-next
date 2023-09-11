import * as dotenv from 'dotenv'

dotenv.config()

import winston from 'winston'
import { logger } from './lib/logging'
import { getCrawler, runCrawlers } from './lib/crawler'
import './crawlers'

logger.format = winston.format.prettyPrint()

const main = async () => {
  try {
    const crawlers = getCrawler(process.argv[2])
    const results = await runCrawlers([crawlers])
    logger.info(results)
  } catch (error: any) {
    logger.error('Crawler failed', error)
  }
}

main()
