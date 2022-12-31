import { Page, Element } from '../lib/browser'
import { Crawler, register } from '../lib/crawler'

class Schueuer extends Crawler {
  key = 'schueuer'
  title = 'Schüür'
  url = 'https://www.schuur.ch/programm'
  city = 'Luzern'

  prepareDate(date: string) {
    return date
  }

  getEventElements(page: Page) {
    return page.query('.event-list-box')
  }

  getStart(element: Element) {
    return element
      .query('meta[itemprop="startDate"]')
      .then(element => element?.getAttribute('content'))
  }

  getTitle(element: Element) {
    return element.childText('.event-name')
  }

  getUrl(element: Element) {
    return element
      .query('.event-box-details-link')
      .then(element => element?.getAttribute('href'))
  }
}

register(new Schueuer())
