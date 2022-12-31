import { Crawler, register } from '../lib/crawler'
import { Element, Page } from '../lib/browser'

class Mokka extends Crawler {
  key = 'mokka'
  public title = 'Mokka'
  public url = 'https://mokka.ch'
  public city = 'Thun'
  dateFormat = 'dd. MMM'

  async getEventElements(page: Page) {
    return page.query('a.shows')
  }

  async getTitle(element: Element) {
    return element.childText('.title-section')
  }

  async getStart(element: Element) {
    return element.childText('.date')
  }

  async getUrl(element: Element) {
    return element.getAttribute('href')
  }

  prepareDate(date: string) {
    return date.slice(4, 11)
  }
}

register(new Mokka())
