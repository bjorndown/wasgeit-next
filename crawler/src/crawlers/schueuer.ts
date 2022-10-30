import { Page } from '../lib/browser'
import { Crawler } from '../lib/crawler'

export const crawler: Crawler = {
  name: 'Schüür',
  url: 'https://www.schuur.ch/programm',
  city: 'Luzern',
  providesTime: true,
  crawl: async (page: Page) => {
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
  },
  prepareDate: (date: string) => {
    return [date, 'ISO']
  },
}
