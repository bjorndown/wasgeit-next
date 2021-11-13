import { Page } from '../browser'
import { Crawler } from '../crawler'

const BASE_URL = 'https://www.turnhalle.ch'

const crawl = async (page: Page) => {
  const elements = await page.query('.event a')

  return await Promise.all(
    elements.map(async (element) => {
      const [start, title, url] = await Promise.all([
        element.childText('h4'),
        element.childText('h2'),
        element.getAttribute('href').then((path): string => `${BASE_URL}${path}`),
      ])
      return { start, title, url }
    })
  )
}

const prepareDate = (date: string) => {
  const cleaned = date.replaceAll(' ', '').slice(3, 11)
  return [cleaned, 'dd.MM.yy']
}

export default {
  name: 'Turnhalle',
  url: BASE_URL,
  crawl,
  prepareDate,
} as Crawler
