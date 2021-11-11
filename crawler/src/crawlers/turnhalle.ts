import { parse, startOfDay } from 'date-fns'
import { Crawler, Page } from '..'

const URL = 'https://www.turnhalle.ch'

const crawl = async (page: Page) => {
  const elements = await page.query('.event a')

  return await Promise.all(
    elements.map(async (element) => {
      const [start, title, url] = await Promise.all([
        element.childText('h4'),
        element.childText('h2'),

        element.getAttribute('href').then((path): string => `${URL}${path}`),
      ])
      return { start, title, url }
    })
  )
}

const parseDate = (date: string): Date => {
  const cleaned = date.replaceAll(' ', '').slice(3, 11)
  return parse(cleaned, 'dd.MM.yy', startOfDay(new Date()))
}

export default {
  name: 'Turnhalle',
  url: URL,
  crawl,
  parseDate,
} as Crawler
