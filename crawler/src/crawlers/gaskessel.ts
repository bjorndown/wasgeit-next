import { parse } from 'date-fns'
import { Page } from '../browser'
import { Crawler } from '../crawler'

const crawl = async (page: Page) => {
  const elements = await page.query('#grid .thumb')

  return await Promise.all(
    elements.map(async (element) => {
      const [start, title, url] = await Promise.all([
        element.childText('._Headline_Description'),
        element
          .getAttribute('data-title')
          .then((title) => title.replace('○ ', '')),
        element.getAttribute('href'),
      ])
      return { start, title, url }
    })
  )
}

const parseDate = (date: string): Date => {
  const cleaned = date.slice(3, 11)
  return parse(cleaned, 'dd.MM.yy', new Date())
}

export default {
  name: 'Gaskessel',
  url: 'https://gaskessel.ch/',
  crawl,
  parseDate,
} as Crawler
