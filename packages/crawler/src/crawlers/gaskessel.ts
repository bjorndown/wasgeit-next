import { Page, Element } from '../lib/browser'
import { Crawler, register } from '../lib/crawler'

class Gaskessel extends Crawler {
  key = 'gaskessel'
  BASE_URL = 'https://gaskessel.ch'
  title = 'Gaskessel'
  url = new URL('/programm/', this.BASE_URL).toString()
  city = 'Bern'
  dateFormat = 'dd.MM.yy'

  prepareDate(date: string): string {
    return date.slice(3, 11)
  }

  async getEventElements(page: Page): Promise<Element[]> {
    return page.query('.eventpreview ')
  }

  async getStart(element: Element): Promise<string | undefined> {
    return element.childText('.eventdatum')
  }

  async getTitle(element: Element): Promise<string | undefined> {
    return element.childText('.eventname')
  }

  async getUrl(element: Element): Promise<string | undefined> {
    return element
      .query('a')
      .then(element => element?.getAttribute('data-url'))
      .then(path => new URL(path ?? '', this.BASE_URL).toString())
  }
}

register(new Gaskessel())
