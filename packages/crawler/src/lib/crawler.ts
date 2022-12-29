import {
  endOfDay,
  getYear,
  isBefore,
  parse,
  parseISO,
  setHours,
  setYear,
  startOfDay,
} from 'date-fns'
import _ from 'lodash'
import { logger } from './logging'
import { Browser, openBrowser, Page, Element } from './browser'
import { Event } from '@wasgeit/common/src/types'
import { de } from 'date-fns/locale'
import { zonedTimeToUtc } from 'date-fns-tz'
import { notifySlack } from './slack'

export type RawEvent = {
  url?: string
  title?: string
  start?: string
}

export abstract class Crawler {
  public abstract name: string
  public abstract url: string
  public abstract city: string
  public dateFormat = 'ISO'
  public waitMsBeforeCrawl?: number

  async crawl(page: Page): Promise<Event[]> {
    const elements = await this.getEventElements(page)
    const rawEvents: RawEvent[] = await Promise.all(
      elements.map(async element => {
        const title = await this.getTitle(element)
        const start = await this.getStart(element)
        const url = await this.getUrl(element)
        return { title, start, url }
      })
    )

    const eventsWithVenue = rawEvents.map(rawEvent => ({
      ...rawEvent,
      venue: `${this.name}, ${this.city}`,
    }))

    return this.postProcess(eventsWithVenue)
  }

  postProcess(events: RawEvent[]): Event[] {
    const today = new Date()

    // Problem: Most venues only specify day and month of their events. If a venue publishes events more
    // than a year in advance, those events will be placed in the current year.
    // Solution: Assume venues list their events chronologically. Keep track of last event's date.
    // If an event's date is older than that date the event must be from next year. Then we set the year
    // accordingly.
    let previousDate = startOfDay(new Date())

    return events.filter(this.filterIncomplete).map(event => {
      const processedEvent = this.processDate(
        event as Event,
        today,
        previousDate
      )
      previousDate = parseISO(processedEvent.start)
      return processedEvent
    })
  }

  processDate(
    event: Event,
    today: Date,
    previousDate: Date | undefined
  ): Event {
    const eventDateString = this.prepareDate(event.start)
    const dateContainsYear =
      this.dateFormat.includes('yy') || this.dateFormat === 'ISO'
    const dateContainsTime =
      this.dateFormat.includes('HH') || this.dateFormat === 'ISO'
    try {
      const referenceTime = endOfDay(new Date())
      let eventDateLocal =
        this.dateFormat === 'ISO'
          ? parseISO(eventDateString)
          : parse(eventDateString, this.dateFormat, referenceTime, {
              locale: de,
            })

      if (!dateContainsTime) {
        // Setting the time to 8 o'clock produces more sensible calendar entries in the frontend
        // If we parse a date-only value the event's start time will be 00:00, which will create a calendar entry lasting from 00:00 to 23:59
        logger.log({ level: 'debug', message: 'setting time', url: event.url })
        eventDateLocal = setHours(eventDateLocal, 20)
      }

      if (
        previousDate &&
        isBefore(eventDateLocal, previousDate) &&
        !dateContainsYear
      ) {
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
        message: `error while parsing '${eventDateString}' as '${this.dateFormat}'`,
        event,
        error,
      })
      throw error
    }
  }

  prepareDate(date: string) {
    return date
  }

  filterIncomplete(event: RawEvent) {
    const included =
      !_.isEmpty(event.start) &&
      !_.isEmpty(event.title) &&
      !_.isEmpty(event.url)
    if (!included) {
      logger.log({
        level: 'warn',
        message: 'excluding because incomplete',
        event,
      })
    }
    return included
  }

  abstract getTitle(element: Element): Promise<string | undefined>

  abstract getStart(element: Element): Promise<string | undefined>

  abstract getUrl(element: Element): Promise<string | undefined>

  abstract getEventElements(page: Page): Promise<Element[]>

  onLoad() {}
}

export const runCrawlers = async (crawlers: Crawler[]): Promise<Event[]> => {
  const browser = await openBrowser()

  const eventsPerVenue = await Promise.all(
    crawlers.map(crawler => crawl(crawler, browser))
  )

  await browser.close()
  const events = eventsPerVenue.flat(1)

  logger.log({ level: 'info', message: `collected ${events.length} events` })

  return events
}

const crawl = async (crawler: Crawler, browser: Browser) => {
  try {
    logger.log({ level: 'info', message: `crawling ${crawler.name}` })
    const page = await browser.openPage(crawler)
    const events = await crawler.crawl(page)

    await notifySlack(
      `crawler '${crawler.name}' returned ${events.length} events`
    )

    return events
  } catch (error: any) {
    logger.error({
      level: 'error',
      message: 'error during crawling',
      error: error.toString(),
      stacktrace: error.stacktrace,
    })
    await notifySlack(`crawler ${crawler.name} failed: ${error}`)
    return []
  }
}

const crawlers: { [key: string]: Crawler } = {}

export const register = (crawler: Crawler) => (crawlers[crawler.name] = crawler)
export const getCrawlers = () => Object.values(crawlers)
export const getCrawler = (name: string) => {
  if (!(name in crawlers)) {
    throw new Error(
      `crawler ${name} not registered, available are: ${Object.keys(crawlers)}`
    )
  }
  return crawlers[name]
}
