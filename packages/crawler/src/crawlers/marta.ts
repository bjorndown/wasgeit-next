import { Element, Page } from '../lib/browser'
import { Crawler, register } from '../lib/crawler'

const URL = 'https://www.cafemarta.ch'

class Marta extends Crawler {
  name = 'Marta'
  url = URL
  city = 'Bern'
  dateFormat = 'MMMd'
  waitMsBeforeCrawl = 5_000

  getEventElements(page: Page) {
    return page.query('.eapp-events-calendar-grid-item')
  }

  getStart(element: Element) {
    return element.childText('.eapp-events-calendar-date-element-start')
  }

  getTitle(element: Element) {
    return element.childText('.eapp-events-calendar-grid-item-name')
  }

  getUrl(element: Element) {
    return Promise.resolve(this.url)
  }
}

register(new Marta())
