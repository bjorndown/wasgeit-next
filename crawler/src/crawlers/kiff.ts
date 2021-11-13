import { parse, startOfDay } from 'date-fns'
import { de } from 'date-fns/locale'
import { Page } from '../browser'
import { Crawler } from '../crawler'

const baseUrl = 'https://www.kiff.ch'

const crawl = async (page: Page) => {
  const elements = await page.query('.programm-grid.listview a')

  return await Promise.all(
    elements.map(async (element) => {
      const [start, title, url] = await Promise.all([
        element.childText('.event-date'),
        element.getAttribute('title'),
        element.getAttribute('href').then((path) => `${baseUrl}${path}`),
      ])
      return { start, title, url }
    })
  )
}

const parseDate = (date: string): Date => {
  const cleaned = date.replace('\n', '').trim().slice(3, 9)
  return parse(cleaned, 'dd MMM', startOfDay(new Date()), { locale: de })
}

export default {
  name: 'Kiff',
  url: `${baseUrl}/de/home.html?view=list`,
  crawl,
  parseDate,
} as Crawler
