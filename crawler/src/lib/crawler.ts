import {
  endOfDay,
  getYear,
  isBefore,
  isPast,
  parse,
  parseISO,
  setHours,
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
  city: string
  providesTime?: boolean
  crawl: (page: Page) => Promise<RawEvent[]>
  prepareDate: (date: string) => [string, 'ISO' | string]
  onLoad?: () => void
  waitMsBeforeCrawl?: number
}

export const runCrawlers = async (crawlers: Crawler[]): Promise<Event[]> => {
  const browser = await openBrowser()

  const eventsPerCrawler: Record<string, Event[]> = {}
  await Promise.all(
    crawlers.map(async crawler => {
      try {
        logger.log({ level: 'info', message: `crawling ${crawler.name}` })
        const page = await browser.openPage(crawler)
        const rawEvents = await crawler.crawl(page)
        const eventsWithVenue = rawEvents.map(rawEvent => ({
          ...rawEvent,
          venue: `${crawler.name}, ${crawler.city}`,
        }))

        eventsPerCrawler[crawler.name] = postProcess(
          eventsWithVenue,
          crawler
        ).filter(event => !isPast(parseISO(event.start)))
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
  const today = new Date()

  // Problem: Most venues only specify day and month of their events. If a venue publishes events more
  // than a year in advance, those events will be placed in the current year.
  // Solution: Assume venues list their events chronologically. Keep track of last event's date.
  // If an event's date is older than that date the event must be from next year. Then we set the year
  // accordingly.
  let previousDate: Date

  return events
    .filter(event => {
      const included =
        !_.isEmpty(event.start) &&
        !_.isEmpty(event.title) &&
        !_.isEmpty(event.url)
      if (!included) {
        logger.log({ level: 'warn', message: 'excluding', event })
      }
      return included
    })
    .map(event => {
      const processedEvent = processDate(
        event as Event,
        crawler,
        today,
        previousDate
      )
      previousDate = parseISO(processedEvent.start)
      return processedEvent
    })
}

export const processDate = (
  event: Event,
  crawler: Crawler,
  today: Date,
  previousDate: Date | undefined
): Event => {
  const [eventDateString, formatString] = crawler.prepareDate(event.start)
  try {
    const referenceTime = endOfDay(new Date())
    let eventDateLocal =
      formatString === 'ISO'
        ? parseISO(eventDateString)
        : parse(eventDateString, formatString, referenceTime, {
            locale: de,
          })

    if (!crawler.providesTime) {
      // Setting the time to 8 o'clock produces more sensible calendar entries in the frontend
      // If we parse a date-only value the event's start time will be 00:00, which will create a calendar entry lasting from 00:00 to 23:59
      logger.log({ level: 'debug', message: 'setting time', url: event.url })
      eventDateLocal = setHours(eventDateLocal, 20)
    }

    if (previousDate && isBefore(eventDateLocal, previousDate)) {
      logger.log({
        level: 'warn',
        message: 'moving to next year',
        url: event.url,
      })
      eventDateLocal = setYear(eventDateLocal, getYear(today) + 1)
    }

    const eventDateUtc = zonedTimeToUtc(eventDateLocal, 'Europe/Zurich')

    return {
      ...event,
      start: eventDateUtc.toISOString(),
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
