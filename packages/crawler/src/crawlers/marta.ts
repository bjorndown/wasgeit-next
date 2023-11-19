import { Element, Page } from '../lib/browser'
import { BrowserBasedCrawler, register } from '../lib/crawler'

class Marta extends BrowserBasedCrawler {
  key = 'marta'
  title = 'Marta'
  url = 'https://www.cafemarta.ch'
  city = 'Bern'
  dateFormat = 'MMM d'
  waitMsBeforeCrawl = 3_000

  getEventElements(page: Page) {
    return page.query('.eapp-events-calendar-grid-item')
  }

  getStart(element: Element) {
    return element.childText('.eapp-events-calendar-date-element-start')
  }

  getTitle(element: Element) {
    return element.childText('.eapp-events-calendar-grid-item-name')
  }

  async getUrl(element: Element) {
    return this.url
  }

  prepareDate(date: string): string {
    return date.replace('MAY', 'MAI')
  }
}

register(new Marta())
