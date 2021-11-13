import { parse, startOfDay } from 'date-fns'
import { Page } from '../browser'
import { Crawler } from '../crawler'
import { de } from 'date-fns/locale'

const urlBase = 'https://www.dynamo.ch'

const crawl = async (page: Page) => {
  const elements = await page.query('.group-infos')

  return await Promise.all(
    elements.map(async (element) => {
      const [start, title, url] = await Promise.all([
        element.childText('.field.field-name-field-event-zeitraum'),
        element.childText('.field.field-name-title'),
        element
          .query('.field.field-name-title a')
          .then((element) => element?.getAttribute('href'))
          .then((path) => `${urlBase}${path}`),
      ])
      return { start, title, url }
    })
  )
}

const parseDate = (date: string): Date => {
  const cleaned = date.split(',')[1].trim().split(' -')[0]
  return parse(cleaned, 'dd. MMMM yyyy', startOfDay(new Date()), { locale: de })
}

export default {
  name: 'Dynamo',
  url: `${urlBase}/veranstaltungen`,
  crawl,
  parseDate,
} as Crawler
