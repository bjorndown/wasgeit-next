import {
  endOfDay,
  getMonth,
  getYear,
  isPast,
  parse,
  parseISO,
  setYear,
} from 'date-fns'
import _ from 'lodash'
import { logger } from './logging'
import { openBrowser, Page } from './browser'
import { Event } from '@wasgeit/common/src/types'
import { de } from 'date-fns/locale'
import { zonedTimeToUtc } from 'date-fns-tz'

export type RawEvent = {
  url?: string
  title?: string
  start?: string
}

export type Crawler = {
  name: string
  url: string
  crawl: (page: Page) => Promise<RawEvent[]>
  prepareDate: (date: string) => [string, 'ISO' | string]
}

export const runCrawlers = async (crawlers: Crawler[]): Promise<Event[]> => {
  const browser = await openBrowser()

  const eventsPerCrawler: Record<string, Event[]> = {}
  await Promise.all(
    crawlers.map(async (crawler) => {
      try {
        logger.log({ level: 'info', message: `crawling ${crawler.name}` })
        const page = await browser.openPage(crawler.url)
        const rawEvents = await crawler.crawl(page)
        const eventsWithVenue = rawEvents.map((rawEvent) => ({
          ...rawEvent,
          venue: crawler.name,
        }))

        eventsPerCrawler[crawler.name] = postProcess(
          eventsWithVenue,
          crawler
        ).filter((event) => !isPast(parseISO(event.start)))
      } catch (error: any) {
        logger.error({
          level: 'error',
          message: 'error during crawling',
          error: error.toString(),
        })
      }
    })
  )

  await browser.close()
  const events = Object.values(eventsPerCrawler).flat(1)

  logger.log({ level: 'info', message: `collected ${events.length} events` })

  return events
}

const postProcess = (events: RawEvent[], crawler: Crawler): Event[] => {
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
    .map((event) => processDate(event as Event, crawler, today))
}

const processDate = (event: Event, crawler: Crawler, today: Date): Event => {
  const [eventDateString, formatString] = crawler.prepareDate(event.start)
  try {
    const eventDate = zonedTimeToUtc(
      formatString === 'ISO'
        ? parseISO(eventDateString)
        : parse(eventDateString, formatString, endOfDay(new Date()), {
            locale: de,
          }),
      'Europe/Zurich'
    )

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
    logger.log({
      level: 'error',
      message: `error while parsing '${eventDateString}' as '${formatString}'`,
      event,
      error,
    })
    throw error
  }
}
