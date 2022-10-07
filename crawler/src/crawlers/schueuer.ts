import { Page } from '../browser'
import { Crawler } from '../crawler'

export const crawler: Crawler = {
  name: 'Schüür',
  url: 'https://www.schuur.ch/programm',
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
