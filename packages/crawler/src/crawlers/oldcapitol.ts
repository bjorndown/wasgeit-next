import { Element, Page } from '../lib/browser'
import { Crawler, register } from '../lib/crawler'

class OldCapitol extends Crawler {
  BASE_URL = 'https://oldcapitol.ch'
  key = 'oldcapitol'
  title = 'Old Capitol'
  url = new URL('/events', this.BASE_URL).toString()
  city = 'Langenthal'
  dateFormat = 'dd.MM.'
  waitMsBeforeCrawl = 1_000

  prepareDate(date: string) {
    return date.slice(2).trim()
  }

  getEventElements(page: Page) {
    return page.query('.event-info')
  }

  getStart(element: Element) {
    return element.childText('.event-date')
  }

  getTitle(element: Element) {
    return element.childText('div:nth-child(2) > h4.mb-0')
  }

  getUrl(element: Element) {
    return element
      .getAttribute('href')
      .then(path => new URL(path, this.BASE_URL).toString())
  }
}

register(new OldCapitol())
