import { Page } from '../lib/browser'
import { Crawler } from '../lib/crawler'

const BASE_URL = 'https://www.dachstock.ch'

export const crawler: Crawler = {
  name: 'Dachstock',
  url: `${BASE_URL}/events`,
  city: 'Bern',
  providesTime: true,
  crawl: async (page: Page) => {
    const elements = await page.query('.event-list .event-teaser-info')

    return Promise.all(
      elements.map(async element => {
        const start = await element.childText('.event-teaser-top a')
        const titlePart = await element.childText('a .event-title')
        const artists = await element.childText('a .artist-list')
        const anchor = await element.query('a')
        const href = await anchor?.getAttribute('href')
        return {
          start,
          title: `${titlePart}${titlePart ? ': ' : ''}${artists}`,
          url: `${BASE_URL}${href}`,
        }
      })
    )
  },
  prepareDate: (date: string) => {
    const cleaned = date.slice(4, 22)
    return [cleaned, 'dd.MM.yyyy - HH:mm']
  },
  waitMsBeforeCrawl: 400,
}
