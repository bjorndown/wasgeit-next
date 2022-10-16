import { Page } from '../lib/browser'
import { Crawler } from '../lib/crawler'

const BASE_URL = 'https://oldcapitol.ch'

export const crawler: Crawler = {
  name: 'Old Capitol',
  url: `${BASE_URL}/events`,
  crawl: async (page: Page) => {
    const elements = await page.query('.event')

    return await Promise.all(
      elements.map(async (element) => {
        const [start, title, url] = await Promise.all([
          element.childText('.event-date'),
          element.childText('div:nth-child(2) > h4.mb-0'),
          element.getAttribute('href').then((path) => `${BASE_URL}${path}`),
        ])
        return { start, title, url }
      })
    )
  },
  prepareDate: (date: string) => {
    const cleaned = date.slice(2)
    return [cleaned, 'dd.MM.']
  },
}
