import {parse} from 'date-fns'
import { Page } from '../browser'
import { Crawler } from '../crawler'

const crawl = async (page: Page) => {
  const elements = await page.query('.event.event-list')

  return await Promise.all(
      elements.map(async (element) => {
        const [start, title, url] = await Promise.all([
          element.childText('.event-date'),
          element.childText('h3'),
          element.getAttribute('data-url'),
        ])
        return {start, title, url}
      })
  )
}

const parseDate = (date: string): Date => {
  const cleaned = date.slice(5).replace('- Doors: ','')
  return parse(cleaned, 'd.M yyyy HH:mm', new Date())
}

export default {
  name: 'Dachstock',
  url: 'https://www.dachstock.ch/unser-programm/',
  crawl,
  parseDate,
} as Crawler

