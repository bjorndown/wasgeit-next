import puppeteer from 'puppeteer'
import {
  Event,
  EventsByDate,
} from '@wasgeit/common/src/types'
import fs from 'fs'
import crawlers from './crawlers/index'
import { EvaluateFn } from 'puppeteer'
import {
  format,
  parseISO,
  isPast,
  getMonth,
  setYear,
  getYear,
  formatISO,
} from 'date-fns'
import _ from 'lodash'

export type Crawler = {
  name: string
  url: string
  crawl: (page: Page) => Promise<Event[]>
  parseDate: (date: string) => Date
}

type EventsByWeekAndDate = Record<string, EventsByDate>

export class Page {
  constructor(private page: puppeteer.Page) {}

  async query(selector: string): Promise<Element[]> {
    const elements = await this.page.$$(selector)
    return elements.map((element) => new Element(element))
  }
}

export class Element {
  constructor(private element: puppeteer.ElementHandle) {}

  async getAttribute(attributeName: string): Promise<string> {
    return this.element.evaluate(
      (e, attr) => e.attributes.getNamedItem(attr)?.textContent?.trim() ?? '',
      attributeName
    )
  }

  async query(selector: string): Promise<Element | null> {
    const element = await this.element.$(selector)
    return element ? new Element(element) : null
  }

  async queryAll(selector: string): Promise<Element[]> {
    const elements = await this.element.$$(selector)
    return elements.map((element) => new Element(element))
  }

  async textContent(): Promise<string> {
    return this.element.evaluate((e) => e.textContent?.trim() ?? '')
  }

  async childText(selector: string): Promise<string> {
    const element = await this.query(selector)
    return element
      ? (await element.evaluate((e) => e.textContent?.trim())) ?? ''
      : ''
  }

  async evaluate<T extends EvaluateFn>(fn: T, ...args: any[]) {
    return this.element.evaluate<T>(fn, args)
  }
}

const groupByCalendarWeek = (
  events: Event[],
  eventsByWeek: EventsByWeekAndDate
) => {
  events.map((event) => {
    const eventStart = parseISO(event.start)
    const eventDate = formatISO(eventStart, { representation: 'date' })
    const calendarWeek = format(eventStart, 'yyyy-II')
    if (!eventsByWeek[calendarWeek]) {
      eventsByWeek[calendarWeek] = {}
    }
    if (!eventsByWeek[calendarWeek][eventDate]) {
      eventsByWeek[calendarWeek][eventDate] = []
    }
    eventsByWeek[calendarWeek][eventDate].push(event)
  })
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
        console.debug('excluding', JSON.stringify(event))
      }
      return included
    })
    .map((event) => {
      try {
        const eventDate = crawler.parseDate(event.start)

        if (getMonth(eventDate) < getMonth(today)) {
          console.debug('moving', event.url, 'to next year')
          setYear(eventDate, getYear(today) + 1)
        }

        return {
          ...event,
          start: eventDate.toISOString(),
        }
      } catch (error) {
        console.error('error while parsing', JSON.stringify(event))
        throw error
      }
    })
}

const main = async () => {
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/vivaldi' })

  const eventsByWeek: EventsByWeekAndDate = {}

  for await (const crawler of crawlers) {
    try {
      console.debug('crawling', crawler.name)
      const page = await browser.newPage()
      await page.goto(crawler.url)
      await page.waitForTimeout(5000)
      const rawEvents = (await crawler.crawl(new Page(page))).map(
        (rawEvent) => ({ ...rawEvent, venue: crawler.name })
      )
      groupByCalendarWeek(
        postProcess(rawEvents, crawler).filter(
          (event) => !isPast(parseISO(event.start))
        ),
        eventsByWeek
      )
    } catch (error) {
      console.error(error)
    }
  }

  await browser.close()

  Object.entries(eventsByWeek).map(([calendarWeek, events]) => {
    fs.writeFileSync(
      `../frontend/public/${calendarWeek}.json`,
      JSON.stringify(events)
    )
  })
}

main().catch((error) => console.error(error))
