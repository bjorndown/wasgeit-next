import { parseISO } from 'date-fns'
import { Crawler, Page } from '..'

const crawl = async (page: Page) => {
  const elements = await page.query('.event-list-box')

  return await Promise.all(
    elements.map(async (element) => {
      const [start, title, url] = await Promise.all([
        element
          .query('meta[itemprop="startDate"]')
          .then((element) => element?.getAttribute('content')),
        element.childText('.event-name'),
        element
          .query('.event-box-details-link')
          .then((element) => element?.getAttribute('href')),
      ])
      return { start, title, url }
    })
  )
}

const parseDate = (date: string): Date => {
  return parseISO(date)
}

export default {
  name: 'Schüür',
  url: 'https://www.schuur.ch/programm',
  crawl,
  parseDate,
} as Crawler
