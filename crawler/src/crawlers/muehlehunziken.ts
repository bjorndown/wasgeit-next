import { Page } from '../browser'
import { Crawler } from '../crawler'

const crawl = async (page: Page) => {
  const elements = await page.query('.tribe-events-calendar-list__event-row')

  return await Promise.all(
    elements.map(async (element) => {
      const [start, title, url] = await Promise.all([
        element
          .query('time')
          .then((element) => element?.getAttribute('datetime')),
        element.childText('.tribe-events-calendar-list__event-description'),
        element
          .query('.tribe-events-calendar-list__event-featured-image-link')
          .then((element) => element?.getAttribute('href')),
      ])
      return { start, title, url }
    })
  )
}

const prepareDate = (date: string) => {
  return [date, 'ISO']
}

export default {
  name: 'Mühle Hunziken',
  url: 'https://muehlehunziken.ch/programm',
  crawl,
  prepareDate,
} as Crawler
