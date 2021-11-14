import { logger } from './logging'
import { Crawler, runCrawlers } from './crawler'
import path from 'path'
import crawlers from './crawlers'

const getCrawlers = (): Promise<Crawler>[] => {
  if (!process.argv[2]) {
    return crawlers
  }

  const modulePath = path.join(__dirname, 'crawlers', process.argv[2])
  return [import(modulePath).then((module) => module.default)]
}

const main = async () => {
  try {
    const finalEvents = await runCrawlers(getCrawlers())
    console.log(finalEvents)
  } catch (error) {
    logger.error(error)
  }
}

main().catch((error) => logger.error(error))
