import { Page, Element } from '../lib/browser'
import { BrowserBasedCrawler, register } from '../lib/crawler'

class Docks extends BrowserBasedCrawler {
  key = 'docks'
  title = 'Docks'
  url = 'https://www.docks.ch/programme/'
  city = 'Lausanne'
  dateFormat = 'dd.MM.yyyy'

  prepareDate(date: string) {
    return date.slice(0, 10)
  }

  getEventElements(page: Page): Promise<Element[]> {
    return page.query('.concerts > a')
  }

  getStart(element: Element): Promise<string | undefined> {
    return element.childText('.programme-item-date')
  }

  getTitle(element: Element): Promise<string | undefined> {
    return element.childText('.event-item-title.programme-item-title')
  }

  getUrl(element: Element): Promise<string | undefined> {
    return element.getAttribute('href')
  }
}

register(new Docks())
