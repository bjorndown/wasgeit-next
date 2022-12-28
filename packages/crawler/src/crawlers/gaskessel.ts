import { Page } from '../lib/browser'
import { Crawler } from '../lib/crawler'

const HOST = 'https://gaskessel.ch'

export const crawler: Crawler = {
  name: 'Gaskessel',
  url: `${HOST}/programm/`,
  city: 'Bern',
  crawl: async (page: Page) => {
    const elements = await page.query('.eventpreview ')

    return Promise.all(
      elements.map(async (element) => {
        const [start, title, url] = await Promise.all([
          element.childText('.eventdatum'),
          element.childText('.eventname'),
          element
            .query('a')
            .then((element) => element?.getAttribute('data-url'))
            .then((path) => `${HOST}${path}`),
        ])

        return { start, title, url }
      })
    )
  },
  prepareDate: (date: string) => {
    const cleaned = date.slice(3, 11)
    return [cleaned, 'dd.MM.yy']
  },
}
