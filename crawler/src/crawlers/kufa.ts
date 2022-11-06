import { Page } from '../lib/browser'
import { Crawler } from '../lib/crawler'

export const crawler: Crawler = {
  name: 'KUFA',
  url: `https://www.kufa.ch`,
  city: 'Lyss',
  crawl: async (page: Page) => {
    const elements = await page.query('.post-listing-entry-event article a')

    return Promise.all(
      elements.map(async (element) => {
        const [start, title, url] = await Promise.all([
          element.childText('.info'),
          element.childText('.title'),
          element.getAttribute('href'),
        ])
        return { start, title, url }
      })
    )
  },
  prepareDate: (date: string) => {
    const cleaned = date.split(' ')?.[1]
    return [cleaned, 'dd.MM.yyyy']
  },
}
