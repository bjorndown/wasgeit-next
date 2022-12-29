import { Element, Page } from '../lib/browser'
import { Crawler, register } from '../lib/crawler'

const BASE_URL = 'https://oldcapitol.ch'

class OldCapitol extends Crawler {
  name = 'Old Capitol'
  url = `${BASE_URL}/events`
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
    return element.getAttribute('href').then(path => `${BASE_URL}${path}`)
  }
}

register(new OldCapitol())
