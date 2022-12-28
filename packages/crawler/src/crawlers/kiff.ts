import { Page } from '../lib/browser'
import { Crawler } from '../lib/crawler'

const BASE_URL = 'https://www.kiff.ch'

export const crawler: Crawler = {
  name: 'Kiff',
  url: `${BASE_URL}/de/home.html?view=list`,
  city: 'Aarau',
  crawl: async (page: Page) => {
    const elements = await page.query('.programm-grid.listview a')

    return Promise.all(
      elements.map(async (element) => {
        const [start, title, url] = await Promise.all([
          element.childText('.event-date'),
          element.getAttribute('title'),
          element.getAttribute('href').then((path) => `${BASE_URL}${path}`),
        ])
        return { start, title, url }
      })
    )
  },
  prepareDate: (date: string) => {
    const cleaned = date.replace('\n', '').trim().slice(3, 9)
    return [cleaned, 'dd MMM']
  },
}
