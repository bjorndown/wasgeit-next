import { Page, Element } from '../lib/browser'
import { BrowserBasedCrawler, register } from '../lib/crawler'

class BogenF extends BrowserBasedCrawler {
  key = 'bogenf'
  BASE_URL = 'https://www.bogenf.ch'
  title = 'Bogen F'
  city = 'Zürich'
  url = new URL('/konzerte/aktuell', this.BASE_URL).toString()
  dateFormat = 'MMMM dd'

  getEventElements(page: Page): Promise<Element[]> {
    return page.query('.concert-month-container > div')
  }

  async getStart(element: Element): Promise<string | undefined> {
    const parent = await element.parentElement()
    const month = await parent.childText('.concert-month')
    const day = await element.childText('.concert-date span')
    return `${month.split(' ')[0]} ${day.split(' ')[1]}`
  }

  async getTitle(element: Element): Promise<string | undefined> {
    const band = await element.childText('.concert-band-title')
    const support = await element.childText('.concert-supportband-title')
    return [band, support].filter(value => !!value).join(', ')
  }

  async getUrl(element: Element): Promise<string | undefined> {
    const link = await element.query('.concert-bands a')
    const path = await link?.getAttribute('href')
    return new URL(path ?? '', this.BASE_URL).toString()
  }
}

register(new BogenF())
