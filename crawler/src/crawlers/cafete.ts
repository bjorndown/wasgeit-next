import { Page } from '../lib/browser'
import { Crawler } from '../lib/crawler'

const URL = 'https://cafete.ch/'

export const crawler: Crawler = {
  name: 'Cafete',
  url: URL,
  city: 'Bern',
  crawl: async (page: Page) => {
    const elements = await page.query('.event')

    return await Promise.all(
      elements.map(async (element) => {
        const [start, title, url] = await Promise.all([
          element.childText('.date'),
          Promise.all([
            element.childText('.title'),
            element.childText('.acts'),
          ]).then(([title, acts]) => `${title} ${acts}`),
          URL,
        ])
        return { start, title, url }
      })
    )
  },
  prepareDate: (date: string) => {
    const cleaned = date.replace(' — Doors:', '').slice(3, 25)
    return [cleaned, "dd. MMMM yyyy HH'h'mm"]
  },
}
