import { Page, Element } from '../lib/browser'
import { Crawler, register } from '../lib/crawler'

class Isc extends Crawler {
  name = 'ISC'
  url = 'https://www.isc-club.ch'
  city = 'Bern'
  dateFormat = 'dd.MM.'

  getEventElements(page: Page): Promise<Element[]> {
    return page.query('.event_preview')
  }

  getStart(element: Element): Promise<string | undefined> {
    return element.childText('.event_title_date')
  }

  getTitle(element: Element): Promise<string | undefined> {
    return element.childText('.event_title_title')
  }

  getUrl(element: Element): Promise<string | undefined> {
    return element.getAttribute('href')
  }
}

register(new Isc())
