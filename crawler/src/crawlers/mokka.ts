import { parse, startOfDay } from 'date-fns'
import { Crawler, Page } from '..'
import { de } from 'date-fns/locale'

const crawl = async (page: Page) => {
  const elements = await page.query('a.shows')

  return await Promise.all(
    elements.map(async (element) => {
      const [start, title, url] = await Promise.all([
        element.childText('.date'),
        element.childText('.title-section'),
        element.getAttribute('href'),
      ])
      return { start, title, url }
    })
  )
}

const parseDate = (date: string): Date => {
  const cleaned = date.slice(4, 11)
  return parse(cleaned, 'dd. MMM', startOfDay(new Date()), { locale: de })
}

export default {
  name: 'Mokka',
  url: 'https://mokka.ch',
  crawl,
  parseDate,
} as Crawler
