import { parse } from 'date-fns'
import { Crawler, Page } from '..'

const crawl = async (page: Page) => {
  const elements = await page.query('.events__link')

  return await Promise.all(
    elements.map(async (element) => {
      const [start, title, url] = await Promise.all([
        element.childText('.events__date'),
        element
          .childText('.events__title'),

        element.getAttribute('href'),
      ])
      return { start, title, url }
    })
  )
}

const parseDate = (date: string): Date => {
  const cleaned = date.slice(3, 11)
  return parse(cleaned, 'dd.MM', new Date())
}

export default {
  name: 'Kofmehl',
  url: 'https://kofmehl.net/',
  crawl,
  parseDate,
} as Crawler
