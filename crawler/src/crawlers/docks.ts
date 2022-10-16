import { Page } from '../lib/browser'
import { Crawler } from '../lib/crawler'

export const crawler: Crawler = {
  name: 'Docks',
  url: 'https://www.docks.ch/programme/',
  crawl: async (page: Page) => {
    const elements = await page.query('.concerts > a')

    return await Promise.all(
      elements.map(async (element) => {
        const [start, title, url] = await Promise.all([
          element.childText('.programme-item-date'),
          element.childText('.event-item-title.programme-item-title'),
          element.getAttribute('href'),
        ])
        return { start, title, url }
      })
    )
  },
  prepareDate: (date: string) => {
    const cleaned = date.slice(0, 10)
    return [cleaned, 'dd.MM.yyyy']
  },
}
