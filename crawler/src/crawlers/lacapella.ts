import { Page } from '../lib/browser'
import { Crawler } from '../lib/crawler'

const BASE_URL = 'https://www.la-cappella.ch'

export const crawler: Crawler = {
  name: 'La Cappella',
  url: new URL('de/spielplan-4.html', BASE_URL).toString(),
  city: 'Bern',
  providesTime: true,
  crawl: async (page: Page) => {
    const monthGroups = await page.query('.eventlist__group')

    const eventsPerMonth = await Promise.all(
      monthGroups.map(async monthGroup => {
        const monthYear = await monthGroup.childText('h2')
        const eventElements = await monthGroup.queryAll('.lc-event')

        return Promise.all(
          eventElements.map(async element => {
            const date = await element.childText('.lc-event__date')
            const time = await element.childText('.lc-event__time')
            const title = await element.childText('.lc-event__text')
            const anchor = await element.query('.lc-event__text')
            const href = await anchor?.getAttribute('href')
            const url = new URL(href ?? '', BASE_URL).toString()

            return { start: `${date} ${monthYear} ${time}`, title, url }
          })
        )
      })
    )

    return eventsPerMonth.flat()
  },
  prepareDate: (date: string) => {
    return [date, "dd. MMMM yyyy HH:mm 'Uhr'"]
  },
}
