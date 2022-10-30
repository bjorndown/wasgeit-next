import { Page } from '../lib/browser'
import { Crawler } from '../lib/crawler'

const BASE_URL = 'https://www.turnhalle.ch'

export const crawler: Crawler = {
  name: 'Turnhalle',
  url: BASE_URL,
  city: 'Bern',
  crawl: async (page: Page) => {
    const elements = await page.query('.event.box > a')

    return await Promise.all(
      elements.map(async (element) => {
        const [start, title, url] = await Promise.all([
          element.childText('h4'),
          element.childText('h2'),
          element
            .getAttribute('href')
            .then((path): string => `${BASE_URL}${path}`),
        ])
        return { start, title, url }
      })
    )
  },
  prepareDate: (date: string) => {
    const cleaned = date.replaceAll(' ', '').slice(3, 11)
    return [cleaned, 'dd.MM.yy']
  },
  onLoad: () => {
    document.querySelector('.tile.footer')?.scrollIntoView()
  },
}
