import { Page } from '../lib/browser'
import { Crawler } from '../lib/crawler'

const BASE_URL = 'https://www.dieheiterefahne.ch'

export const crawler: Crawler = {
  name: 'Heitere Fahne',
  url: `${BASE_URL}/events`,
  city: 'Bern',
  crawl: async (page: Page) => {
    const elements = await page.query('.vb-content a')

    return Promise.all(
      elements.map(async element => {
        const start = await element.childText('.events__list-item-date')
        const title = await element.childText('.events__list-item-title')
        const href = await element.getAttribute('href')
        return {
          start,
          title,
          url: `${BASE_URL}${href}`,
        }
      })
    )
  },
  prepareDate: (date: string) => {
    const cleaned = date.split(' ')[1].slice()
    return [cleaned, 'dd.MM.yyyy']
  },
  waitMsBeforeCrawl: 400,
}
