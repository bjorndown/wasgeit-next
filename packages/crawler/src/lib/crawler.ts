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
import { Element, openBrowser, Page } from './browser'
import { Event } from '@wasgeit/common/src/types'
import { de } from 'date-fns/locale'
import { zonedTimeToUtc } from 'date-fns-tz'

export type RawEvent = {
  url?: string
  title?: string
  start?: string
}

export type CrawlResult = {
  key: string
  events: Event[]
  failed: { event: RawEvent; error: any }[]
  ignored: { event: RawEvent; reason: string }[]
}

export abstract class Crawler {
  public abstract key: string
  public abstract title: string
  public abstract url: string
  public abstract city: string
  public dateFormat = 'ISO'
  public waitMsBeforeCrawl?: number

  async crawl(page: Page): Promise<CrawlResult> {
    const ignored: CrawlResult['ignored'] = []

    const rawEvents = await this.getRawEvents(page)

    const completeEvents = rawEvents.filter((event: RawEvent) => {
      const isIncomplete =
        _.isEmpty(event.start) || _.isEmpty(event.title) || _.isEmpty(event.url)

      if (isIncomplete) {
        ignored.push({ event, reason: 'incomplete' })
        return false
      }
      return true
    })

    const { events, failed } = this.postProcess(completeEvents)

    const eventsWithVenue = events.map(event => ({
      ...event,
      venue: `${this.title}, ${this.city}`,
    }))

    return { key: this.key, events: eventsWithVenue, failed, ignored }
  }

  protected async getRawEvents(page: Page): Promise<RawEvent[]> {
    const elements = await this.getEventElements(page)
    return Promise.all(
      elements.map(async element => {
        const title = await this.getTitle(element)
        const start = await this.getStart(element)
        const url = await this.getUrl(element)
        return { title, start, url }
      })
    )
  }

  postProcess(events: RawEvent[]): Pick<CrawlResult, 'events' | 'failed'> {
    const today = new Date()

    // Problem: Most venues only specify day and month of their events. If a venue publishes events more
    // than a year in advance, those events will be placed in the current year.
    // Solution: Assume venues list their events chronologically. Keep track of last event's date.
    // If an event's date is older than that date the event must be from next year. Then we set the year
    // accordingly.
    let previousDate = startOfDay(new Date())

    const failed: CrawlResult['failed'] = []

    const eventsWithDate = events
      .map(event => {
        try {
          const processedEvent = this.processDate(
            event as Event,
            today,
            previousDate
          )
          previousDate = parseISO(processedEvent.start)
          return processedEvent
        } catch (error: any) {
          failed.push({ event, error })
        }
      })
      .filter((e): e is Event => !!e)

    return { failed, events: eventsWithDate }
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
        logger.info('setting time', { url: event.url })
        eventDateLocal = setHours(eventDateLocal, 20)
      }

      if (
        previousDate &&
        isBefore(eventDateLocal, previousDate) &&
        !dateContainsYear
      ) {
        logger.info('moving to next year', {
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
      logger.info(
        `error while parsing '${eventDateString}' as '${this.dateFormat}'`,
        {
          event,
          error,
        }
      )
      throw error
    }
  }

  prepareDate(date: string) {
    return date
  }

  abstract getTitle(element: Element): Promise<string | undefined>

  abstract getStart(element: Element): Promise<string | undefined>

  abstract getUrl(element: Element): Promise<string | undefined>

  abstract getEventElements(page: Page): Promise<Element[]>

  onLoad() {}
}

export const runCrawlers = async (crawlers: Crawler[]) => {
  const browser = await openBrowser()

  // TODO naming/type.. Summary?
  const overallResult: {
    successful: CrawlResult[]
    failed: { key: string; error: Error }[]
  } = { successful: [], failed: [] }

  await Promise.all(
    crawlers.map(async crawler => {
      try {
        logger.info('crawling start', {
          crawler: crawler.title,
        })
        const page = await browser.openPage(crawler)
        const result = await crawler.crawl(page)
        logger.info('crawling end', {
          crawler: crawler.title,
        })
        overallResult.successful.push(result)
      } catch (error: any) {
        return overallResult.failed.push({ error, key: crawler.key })
      }
    })
  )

  await browser.close()

  return overallResult
}

const crawlers: { [key: string]: Crawler } = {}

export const register = (crawler: Crawler) => (crawlers[crawler.key] = crawler)
export const getCrawlers = () => Object.values(crawlers)
export const getCrawler = (name: string) => {
  if (!(name in crawlers)) {
    throw new Error(
      `crawler ${name} not registered, available are: ${Object.keys(crawlers)}`
    )
  }
  return crawlers[name]
}
