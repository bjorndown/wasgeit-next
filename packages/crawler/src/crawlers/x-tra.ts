import { Page } from '../lib/browser'
import { Crawler } from '../lib/crawler'

const BASE_URL = 'https://x-tra.ch/'

export const crawler: Crawler = {
  name: 'X-TRA',
  url: new URL('/en/agenda/concerts/', BASE_URL).toString(),
  city: 'Zürich',
  providesTime: true,
  crawl: async (page: Page) => {
    const elements = await page.query('ul.tile li')

    return Promise.all(
      elements.map(async element => {
        const [start, title, url] = await Promise.all([
          element.childText('div h3'),
          element.childText('div h2'),
          element
            .query('a')
            .then(element => element?.getAttribute('href'))
            .then(href => new URL(href ?? '', BASE_URL).toString()),
        ])
        return { start, title, url }
      })
    )
  },
  prepareDate: (date: string) => {
    return [date.slice(4), 'dd.MM.yy']
  },
  onLoad: () => {
    document.querySelector<HTMLElement>('a.more')?.click()
  },
}
