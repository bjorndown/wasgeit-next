import { Page, Element } from '../lib/browser'
import { BrowserBasedCrawler, register } from '../lib/crawler'

class Heiterefahne extends BrowserBasedCrawler {
  key = 'heiterefahne'
  BASE_URL = 'https://www.dieheiterefahne.ch'
  title = 'Heitere Fahne'
  url = new URL('/events', this.BASE_URL).toString()
  city = 'Bern'
  dateFormat = 'dd.MM.yyyy'
  waitMsBeforeCrawl = 400

  prepareDate(date: string) {
    return date.split(' ')[1].slice()
  }

  getEventElements(page: Page): Promise<Element[]> {
    return page.query('.vb-content a')
  }

  getStart(element: Element): Promise<string | undefined> {
    return element.childText('.events__list-item-date')
  }

  getTitle(element: Element): Promise<string | undefined> {
    return element.childText('.events__list-item-title')
  }

  async getUrl(element: Element): Promise<string | undefined> {
    const href = await element.getAttribute('href')
    return new URL(href, this.BASE_URL).toString()
  }
}

register(new Heiterefahne())
