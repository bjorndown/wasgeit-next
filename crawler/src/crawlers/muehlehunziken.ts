import { Page } from '../lib/browser'
import { Crawler } from '../lib/crawler'

export const crawler: Crawler = {
  name: 'Mühle Hunziken',
  url: 'https://muehlehunziken.ch/programm',
  crawl: async (page: Page) => {
    const elements = await page.query('main ul > li > a.customLink')

    return await Promise.all(
      elements.map(async (element) => {
        const [start, title, url] = await Promise.all([
          element.childText('div > div:nth-child(1)'),
          element.childText('div > div:nth-child(2)'),
          element.getAttribute('href'),
        ])

        return { start, title, url }
      })
    )
  },
  prepareDate: (date: string) => {
    const cleaned = date.slice(3)
    return [cleaned, 'd.M.']
  },
}
