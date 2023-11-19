import { Page, Element } from '../lib/browser'
import { BrowserBasedCrawler, register } from '../lib/crawler'

class Dynamo extends BrowserBasedCrawler {
  key = 'dynamo'
  BASE_URL = 'https://www.dynamo.ch'
  title = 'Dynamo'
  city = 'Zürich'
  url = new URL('/veranstaltungen', this.BASE_URL).toString()
  dateFormat = 'dd. MMMM yyyy'

  prepareDate(date: string) {
    return date.split(',')[1].trim().split(' -')[0]
  }

  getEventElements(page: Page): Promise<Element[]> {
    return page.query('.group-infos')
  }

  getStart(element: Element): Promise<string | undefined> {
    return element.childText('.field.field-name-field-event-zeitraum')
  }

  getTitle(element: Element): Promise<string | undefined> {
    return element.childText('.field.field-name-title')
  }

  getUrl(element: Element): Promise<string | undefined> {
    return element
      .query('.field.field-name-title a')
      .then(element => element?.getAttribute('href'))
      .then(path => new URL(path ?? '', this.BASE_URL).toString())
  }
}

register(new Dynamo())
