import { Event } from '@wasgeit/common/src/types'
import { Page, Crawler } from '..'
import { set, startOfDay } from 'date-fns'

const crawl = async (page: Page) => {
  const elements = await page.query('.event_preview')

  const events = await Promise.all(
    elements.map(async (element) => {
      const [start, title, url] = await Promise.all([
        element.childText('.event_title_date'),
        element.childText('.event_title_title'),
        element.getAttribute('href'),
      ])
      return { start, title, url }
    })
  )

  return events
}

const postProcess = (events: Event[]): Event[] => {
  return events.map((event) => {
    const [day, month] = event.start.split('.')
    const date = set(startOfDay(new Date()), {
      date: parseInt(day),
      month: parseInt(month),
    })

    return {
      ...event,
      start: date.toISOString(),
    }
  })
}

export default {
  name: 'ISC',
  url: 'https://www.isc-club.ch',
  crawl,
  postProcess,
} as Crawler
