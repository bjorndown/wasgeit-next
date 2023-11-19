import { Page, Element } from '../lib/browser'
import { BrowserBasedCrawler, register } from '../lib/crawler'

class Sedel extends BrowserBasedCrawler {
  key = 'sedel'
  BASE_URL = 'https://sedel.ch'
  title = 'Sedel'
  url = new URL('/club', this.BASE_URL).toString()
  city = 'Emmenbrücke'

  getEventElements(page: Page): Promise<Element[]> {
    return page.query('.month-list ul li')
  }

  async getStart(element: Element): Promise<string | undefined> {
    const time = await element.query('time')
    return time?.getAttribute('datetime')
  }

  async getTitle(element: Element): Promise<string | undefined> {
    return element.childText('.views-field-title')
  }

  async getUrl(element: Element): Promise<string | undefined> {
    const anchor = await element.query('a')
    const href = await anchor?.getAttribute('href')
    return new URL(href ?? '', this.BASE_URL).toString()
  }
}

register(new Sedel())
