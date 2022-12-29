import { Element, Page } from '../lib/browser'
import { Crawler, register } from '../lib/crawler'

class Roessli extends Crawler {
  name = 'Rössli'
  url = 'https://www.souslepont-roessli.ch/events/'
  city = 'Bern'
  dateFormat = 'dd. MMMM yyyy'

  prepareDate(date: string) {
    return date.slice(4, 16).replace('Mrz', 'Mär').replace('MRZ', 'Mär')
  }

  getEventElements(page: Page) {
    return page.query('div.event > a')
  }

  getStart(element: Element) {
    return element.childText('time.event-date')
  }

  getTitle(element: Element) {
    return element.childText('h2')
  }

  getUrl(element: Element) {
    return element.getAttribute('href')
  }
}

register(new Roessli())
