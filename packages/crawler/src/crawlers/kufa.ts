import { Page, Element } from '../lib/browser'
import { BrowserBasedCrawler, register } from '../lib/crawler'

class Kufa extends BrowserBasedCrawler {
  key = 'kufa'
  title = 'KUFA'
  url = `https://www.kufa.ch`
  city = 'Lyss'
  dateFormat = 'dd.MM.yyyy'

  prepareDate(date: string) {
    return date.split(' ')?.[1]
  }

  getEventElements(page: Page) {
    return page.query('.post-listing-entry-event article a')
  }

  getTitle(element: Element) {
    return element.childText('.title')
  }

  getStart(element: Element) {
    return element.childText('.info')
  }

  getUrl(element: Element) {
    return element.getAttribute('href')
  }
}

register(new Kufa())
