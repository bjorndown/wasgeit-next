import { Page } from '../browser'
import { Crawler } from '../crawler'

export const crawler: Crawler = {
  name: 'Mokka',
  url: 'https://mokka.ch',
  crawl: async (page: Page) => {
    const elements = await page.query('a.shows')

    return await Promise.all(
      elements.map(async (element) => {
        const [start, title, url] = await Promise.all([
          element.childText('.date'),
          element.childText('.title-section'),
          element.getAttribute('href'),
        ])
        return { start, title, url }
      })
    )
  },
  prepareDate: (date: string) => {
    const cleaned = date.slice(4, 11)
    return [cleaned, 'dd. MMM']
  },
}
