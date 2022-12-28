import { Page } from '../lib/browser'
import { Crawler } from '../lib/crawler'

const URL = 'https://www.cafemarta.ch'

export const crawler: Crawler = {
  name: 'Marta',
  url: URL,
  city: 'Bern',
  crawl: async (page: Page) => {
    const elements = await page.query('.eapp-events-calendar-grid-item')

    return Promise.all(
      elements.map(async element => {
        const [start, title, url] = await Promise.all([
          element.childText('.eapp-events-calendar-date-element-start'),
          element.childText('.eapp-events-calendar-grid-item-name'),
          URL,
        ])
        return { start, title, url }
      })
    )
  },
  prepareDate: (date: string) => {
    return [date, 'MMMd']
  },
  waitMsBeforeCrawl: 5_000,
}
