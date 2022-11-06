import { Page } from '../lib/browser'
import { Crawler } from '../lib/crawler'

export const crawler: Crawler = {
  name: 'Bierhübeli',
  url: 'https://bierhuebeli.ch',
  city: 'Bern',
  crawl: async (page: Page) => {
    const elements = await page.query('.w-grid-item-h')

    return Promise.all(
      elements.map(async (element) => {
        const [start, title, url] = await Promise.all([
          element.childText('.event_date'),
          element.childText('.event_titles'),
          element
            .query('.w-grid-item-anchor')
            .then((element) => element?.getAttribute('href')),
        ])
        return { start, title, url }
      })
    )
  },
  prepareDate: (date: string) => {
    const cleaned = date.slice(6)
    return [cleaned, 'dd.MM.yyyy']
  },
}
