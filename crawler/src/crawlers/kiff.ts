import { Page } from '../browser'
import { Crawler } from '../crawler'

const BASE_URL = 'https://www.kiff.ch'

const crawl = async (page: Page) => {
  const elements = await page.query('.programm-grid.listview a')

  return await Promise.all(
    elements.map(async (element) => {
      const [start, title, url] = await Promise.all([
        element.childText('.event-date'),
        element.getAttribute('title'),
        element.getAttribute('href').then((path) => `${BASE_URL}${path}`),
      ])
      return { start, title, url }
    })
  )
}

const prepareDate = (date: string) => {
  const cleaned = date.replace('\n', '').trim().slice(3, 9)
  return [cleaned, 'dd MMM']
}

export default {
  name: 'Kiff',
  url: `${BASE_URL}/de/home.html?view=list`,
  crawl,
  prepareDate,
} as Crawler
