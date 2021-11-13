import fs from 'fs'
import crawlers from './crawlers/index'
import { parseISO, isPast } from 'date-fns'
import { logger } from './logging'
import { postProcess } from './crawler'
import { openBrowser } from './browser'
import { Event } from '@wasgeit/common/src/types'

const main = async () => {
  const browser = await openBrowser()
  let allEvents: Event[] = []

  for await (const crawler of crawlers) {
    try {
      logger.log({ level: 'info', message: `crawling ${crawler.name}` })
      const page = await browser.openPage(crawler.url)
      const rawEvents = await crawler.crawl(page)
      const eventsWithVenue = rawEvents.map((rawEvent) => ({
        ...rawEvent,
        venue: crawler.name,
      }))

      allEvents = allEvents.concat(
        postProcess(eventsWithVenue, crawler).filter(
          (event) => !isPast(parseISO(event.start))
        )
      )
    } catch (error) {
      logger.error(error)
    }
  }

  await browser.close()

  fs.writeFileSync(
    `../frontend/public/events.json`,
    JSON.stringify({ events: allEvents })
  )

  logger.log({ level: 'info', message: `collected ${allEvents.length} events` })
}

main().catch((error) => logger.error(error))
