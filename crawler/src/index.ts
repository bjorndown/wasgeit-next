import fs from 'fs'
import crawlers from './crawlers/index'
import { parseISO, isPast } from 'date-fns'
import { logger } from './logging'
import {
  EventsByWeekAndDate,
  groupByCalendarWeek,
  postProcess,
} from './crawler'
import { openBrowser } from './browser'

const main = async () => {
  const browser = await openBrowser()
  const eventsByWeek: EventsByWeekAndDate = {}

  for await (const crawler of crawlers) {
    try {
      logger.log({ level: 'info', message: `crawling ${crawler.name}` })
      const page = await browser.openPage(crawler.url)
      const rawEvents = await crawler.crawl(page)
      const eventsWithVenue = rawEvents.map((rawEvent) => ({
        ...rawEvent,
        venue: crawler.name,
      }))
      groupByCalendarWeek(
        postProcess(eventsWithVenue, crawler).filter(
          (event) => !isPast(parseISO(event.start))
        ),
        eventsByWeek
      )
    } catch (error) {
      logger.error(error)
    }
  }

  await browser.close()

  let num = 0

  Object.entries(eventsByWeek).map(([calendarWeek, events]) => {
    fs.writeFileSync(
      `../frontend/public/${calendarWeek}.json`,
      JSON.stringify(events)
    )
    num += Object.values(events).flat(1).length
  })

  console.log('collected', num, 'events')
}

main().catch((error) => logger.error(error))
