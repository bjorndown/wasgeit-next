import { Event } from '@wasgeit/common/src/types'
import { parse, set, startOfDay } from 'date-fns'
import { Crawler, Page } from '..'

const crawl = async (page: Page) => {
  const elements = await page.query('.event.event-list')

  const events = await Promise.all(
    elements.map(async (element) => {
      const [start, title, url] = await Promise.all([
        element.childText('.event-date'),
        element.childText('h3'),
        element.getAttribute('data-url'),
      ])
      return { start, title, url }
    })
  )

  return events
}

const parseDate = (date: string): Date => {
  const cleaned = date.slice(5).replace('- Doors: ','')
  return parse(cleaned, 'd.M yyyy HH:mm', new Date())
}

const postProcess = (events: Event[]): Event[] => {
  return events.map((event) => {
    const date = parseDate(event.start)
    console.log(event.start)
    console.log(date)
    return {
      ...event,
      start: date.toISOString(),
    }
  })
}

export default {
  name: 'Dachstock',
  url: 'https://www.dachstock.ch/unser-programm/',
  crawl,
  postProcess,
} as Crawler

