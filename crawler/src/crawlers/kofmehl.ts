import { Page } from '../browser'
import { Crawler } from '../crawler'

export const crawler: Crawler = {
  name: 'Kofmehl',
  url: 'https://kofmehl.net/',
  crawl: async (page: Page) => {
    const elements = await page.query('.events__link')

    return await Promise.all(
      elements.map(async (element) => {
        const [start, title, url] = await Promise.all([
          element.childText('.events__date'),
          element
            .childText('.events__title'),
          element.getAttribute('href'),
        ])
        return { start, title, url }
      })
    )
  },
  prepareDate: (date: string) => {
    const cleaned = date.slice(3, 11)
    return [cleaned, 'dd.MM']
  },
}
