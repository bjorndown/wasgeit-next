import { format, formatISO, getMonth, getYear, parseISO, setYear } from 'date-fns'
import _ from 'lodash'
import { logger } from './logging'
import { Page } from './browser'
import { EventsByDate, Event } from '@wasgeit/common/src/types'

export type Crawler = {
  name: string
  url: string
  crawl: (page: Page) => Promise<Event[]>
  parseDate: (date: string) => Date
}

export type EventsByWeekAndDate = Record<string, EventsByDate>

export const groupByCalendarWeek = (
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

export const postProcess = (events: Event[], crawler: Crawler): Event[] => {
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
    .map((event) => {
      try {
        const eventDate = crawler.parseDate(event.start)

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
        logger.log({ level: 'error', message: 'error while parsing', event })
        throw error
      }
    })
}