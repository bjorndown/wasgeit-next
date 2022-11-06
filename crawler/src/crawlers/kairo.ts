import { Page } from '../lib/browser'
import { Crawler } from '../lib/crawler'

const URL = 'https://www.cafe-kairo.ch/kultur'

export const crawler: Crawler = {
  name: 'Kairo',
  url: URL,
  city: 'Bern',
  crawl: async (page: Page) => {
    const elements = await page.query('article[id]')

    return Promise.all(
      elements.map(async element => {
        const [start, title, url] = await Promise.all([
          element.childText('p'),
          element.childText('h1'),
          element.getAttribute('id').then(id => `${URL}/#${id}`),
        ])
        return { start, title, url }
      })
    )
  },
  prepareDate: (date: string) => {
    return [date.slice(0, 13), 'EEE dd.MM.yyyy']
  },
}