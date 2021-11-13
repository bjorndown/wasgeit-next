import {
  getMonth,
  getYear,
  parse,
  parseISO,
  setYear,
  startOfDay,
} from 'date-fns'
import _ from 'lodash'
import { logger } from './logging'
import { Page } from './browser'
import { Event } from '@wasgeit/common/src/types'
import { de } from 'date-fns/locale'

export type Crawler = {
  name: string
  url: string
  crawl: (page: Page) => Promise<Event[]>
  prepareDate: (date: string) => [string, 'ISO' | string]
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
