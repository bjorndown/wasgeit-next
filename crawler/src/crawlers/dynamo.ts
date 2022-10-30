import { Page } from '../lib/browser'
import { Crawler } from '../lib/crawler'

const BASE_URL = 'https://www.dynamo.ch'

export const crawler: Crawler = {
  name: 'Dynamo',
  city: 'Zürich',
  url: `${BASE_URL}/veranstaltungen`,
  crawl: async (page: Page) => {
    const elements = await page.query('.group-infos')

    return await Promise.all(
      elements.map(async (element) => {
        const [start, title, url] = await Promise.all([
          element.childText('.field.field-name-field-event-zeitraum'),
          element.childText('.field.field-name-title'),
          element
            .query('.field.field-name-title a')
            .then((element) => element?.getAttribute('href'))
            .then((path) => `${BASE_URL}${path}`),
        ])
        return { start, title, url }
      })
    )
  },
  prepareDate: (date: string) => {
    const cleaned = date.split(',')[1].trim().split(' -')[0]
    return [cleaned, 'dd. MMMM yyyy']
  },
}
