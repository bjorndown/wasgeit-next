import { logger } from './logging'
import { Crawler, runCrawlers } from './crawler'
import path from 'path'

const main = async () => {
  try {
    const modulePath = path.join(__dirname, 'crawlers', process.argv[2])
    const crawler: Promise<Crawler> = import(modulePath).then(module => module.default)
    const finalEvents = await runCrawlers([crawler])
    console.log(finalEvents)
  } catch (error) {
    logger.error(error)
  }
}

main().catch((error) => logger.error(error))
