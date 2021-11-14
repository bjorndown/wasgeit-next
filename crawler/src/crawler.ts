import {
  getMonth,
  getYear,
  isPast,
  parse,
  parseISO,
  setYear,
  startOfDay,
} from 'date-fns'
import _ from 'lodash'
import { logger } from './logging'
import { openBrowser, Page } from './browser'
import { Event } from '@wasgeit/common/src/types'
import { de } from 'date-fns/locale'

export type Crawler = {
  name: string
  url: string
  crawl: (page: Page) => Promise<Event[]>
  prepareDate: (date: string) => [string, 'ISO' | string]
}

export const runCrawlers = async (
  crawlers: Promise<Crawler>[]
): Promise<Event[]> => {
  const browser = await openBrowser()
  let events: Event[] = []

  for await (const crawler of crawlers) {
    try {
      logger.log({ level: 'info', message: `crawling ${crawler.name}` })
      const page = await browser.openPage(crawler.url)
      const rawEvents = await crawler.crawl(page)
      const eventsWithVenue = rawEvents.map((rawEvent) => ({
        ...rawEvent,
        venue: crawler.name,
      }))

      events = events.concat(
        postProcess(eventsWithVenue, crawler).filter(
          (event) => !isPast(parseISO(event.start))
        )
      )
    } catch (error) {
      logger.error({ level: 'error', message: 'error during crawling', error })
    }
  }

  await browser.close()

  logger.log({ level: 'info', message: `collected ${events.length} events` })

  return events
}

const postProcess = (events: Event[], crawler: Crawler): Event[] => {
  let today = new Date()
  return events
    .filter((event) => {
      let included =
        !_.isEmpty(event.start) &&
        !_.isEmpty(event.title) &&
        !_.isEmpty(event.url)
      if (!included) {
        logger.log({ level: 'debug', message: 'excluding', event })
      }
      return included
    })
    .map((event) => processDate(event, crawler, today))
}

const processDate = (event: Event, crawler: Crawler, today: Date) => {
  try {
    const [eventDateString, formatString] = crawler.prepareDate(event.start)
    const eventDate =
      formatString === 'ISO'
        ? parseISO(eventDateString)
        : parse(eventDateString, formatString, startOfDay(new Date()), {
            locale: de,
          })

    if (getMonth(eventDate) < getMonth(today)) {
      logger.log({
        level: 'debug',
        message: 'moving to next year',
        url: event.url,
      })
      setYear(eventDate, getYear(today) + 1)
    }

    return {
      ...event,
      start: eventDate.toISOString(),
    }
  } catch (error) {
    logger.log({ level: 'error', message: 'error while parsing', event, error })
    throw error
  }
}
