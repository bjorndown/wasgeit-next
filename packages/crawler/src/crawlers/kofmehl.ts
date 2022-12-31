import { Page, Element } from '../lib/browser'
import { Crawler, register } from '../lib/crawler'

class Kofmehl extends Crawler {
  key = 'kofmehl'
  title = 'Kofmehl'
  url = 'https://kofmehl.net/'
  city = 'Solothurn'
  dateFormat = 'dd.MM'

  prepareDate(date: string) {
    return date.slice(3, 11)
  }

  getEventElements(page: Page): Promise<Element[]> {
    return page.query('.events__link')
  }

  getTitle(element: Element): Promise<string | undefined> {
    return element.childText('.events__title')
  }

  getStart(element: Element): Promise<string | undefined> {
    return element.childText('.events__date')

  }

  getUrl(element: Element): Promise<string | undefined> {
    return element.getAttribute('href')
  }
}

register(new Kofmehl())
