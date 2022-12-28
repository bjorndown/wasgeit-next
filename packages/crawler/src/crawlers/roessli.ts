import { Page } from '../lib/browser'
import { Crawler } from '../lib/crawler'

export const crawler: Crawler = {
  name: 'Rössli',
  url: 'https://www.souslepont-roessli.ch/events/',
  city: 'Bern',
  providesTime: true,
  crawl: async (page: Page) => {
    const elements = await page.query('div.event > a')

    return Promise.all(
      elements.map(async element => {
        const [start, title, url] = await Promise.all([
          element.childText('time.event-date'),
          element.childText('h2'),
          element.getAttribute('href'),
        ])
        return { start, title, url }
      })
    )
  },
  prepareDate: (date: string) => {
    const cleaned = date
      .slice(4, 16)
      .replace('Mrz', 'Mär')
      .replace('MRZ', 'Mär')
    return [cleaned, 'dd. MMMM yyyy']
  },
}
