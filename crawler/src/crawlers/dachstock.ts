import { Page } from '../browser'
import { Crawler } from '../crawler'

export const crawler: Crawler = {
  name: 'Dachstock',
  url: 'https://www.dachstock.ch/unser-programm/',
  crawl: async (page: Page) => {
    const elements = await page.query('.event.event-list')

    return await Promise.all(
      elements.map(async (element) => {
        const [start, title, url] = await Promise.all([
          element.childText('.event-date'),
          element.childText('h3'),
          element.getAttribute('data-url'),
        ])
        return { start, title, url }
      })
    )
  },
  prepareDate: (date: string) => {
    const cleaned = date.replace('- Doors: ', '').slice(4, 20)
    return [cleaned, 'd.M yyyy HH:mm']
  },
}
