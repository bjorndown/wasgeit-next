import { Element, Page } from '../lib/browser'
import { Crawler, register } from '../lib/crawler'

const BASE_URL = 'https://x-tra.ch/'

class XTra extends Crawler {
  key = 'xtra'
  title = 'X-TRA'
  url = new URL('/en/agenda/concerts/', BASE_URL).toString()
  city = 'Zürich'
  dateFormat = 'dd.MM.yy'

  async getEventElements(page: Page) {
    return page.query('ul.tile li')
  }

  async getTitle(element: Element) {
    return element.childText('div h2')
  }

  async getStart(element: Element) {
    return element.childText('div h3')
  }

  async getUrl(element: Element) {
    return element
      .query('a')
      .then(element => element?.getAttribute('href'))
      .then(href => new URL(href ?? '', BASE_URL).toString())
  }

  prepareDate(date: string) {
    return date.slice(4)
  }

  onLoad() {
    document.querySelector<HTMLElement>('a.more')?.click()
  }
}

register(new XTra())
