import { Page } from '../lib/browser'
import { Crawler } from '../lib/crawler'

export const crawler: Crawler = {
  name: 'ISC',
  url: 'https://www.isc-club.ch',
  crawl: async (page: Page) => {
    const elements = await page.query('.event_preview')

    return await Promise.all(
      elements.map(async (element) => {
        const [start, title, url] = await Promise.all([
          element.childText('.event_title_date'),
          element.childText('.event_title_title'),
          element.getAttribute('href'),
        ])
        return { start, title, url }
      })
    )
  },
  prepareDate: (date: string) => {
    return [date, 'dd.MM.']
  },
}
