import { Page } from '../browser'
import { Crawler } from '../crawler'

const BASE_URL = 'https://fri-son.ch'

export const crawler: Crawler = {
  name: 'Fri-Son',
  url: `${BASE_URL}/de/programm`,
  crawl: async (page: Page) => {
    const elements = await page.query('.node.node-event')

    return await Promise.all(
      elements.map(async (element) => {
        const [start, title, url] = await Promise.all([
          element
            .query('.date-display-single')
            .then((el) => el?.getAttribute('content')),
          element.childText('h1'),
          element.getAttribute('about').then((attr) => `${BASE_URL}${attr}`),
        ])
        return { start, title, url }
      })
    )
  },
  prepareDate: (date: string) => {
    return [date, 'ISO']
  },
  onLoad: () => {
    document.querySelector('.block.block-block.last.odd')?.scrollIntoView()
  },
}
