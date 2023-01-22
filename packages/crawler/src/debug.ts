import * as dotenv from 'dotenv'

dotenv.config()

import { logger } from './lib/logging'
import { getCrawler, runCrawlers } from './lib/crawler'

import './crawlers'

const main = async () => {
  try {
    const crawlers = getCrawler(process.argv[2])
    const results = await runCrawlers([crawlers])
    console.dir(results, { depth: null })
  } catch (error: any) {
    logger.error(error)
  }
}

main()
