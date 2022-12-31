import { Page, Element } from '../lib/browser'
import { Crawler, register } from '../lib/crawler'

class Dachstock extends Crawler {
  key = 'dachstock'
  BASE_URL = 'https://www.dachstock.ch'
  title = 'Dachstock'
  url = new URL('/events', this.BASE_URL).toString()
  city = 'Bern'
  dateFormat = 'dd.MM.yyyy - HH:mm'
  waitMsBeforeCrawl = 400

  prepareDate(date: string) {
    return date.slice(4, 22)
  }

  getEventElements(page: Page): Promise<Element[]> {
    return page.query('.event-list .event-teaser-info')
  }

  getStart(element: Element): Promise<string | undefined> {
    return element.childText('.event-teaser-top a')
  }

  async getTitle(element: Element): Promise<string | undefined> {
    const titlePart = await element.childText('a .event-title')
    const artists = await element.childText('a .artist-list')
    return `${titlePart}${titlePart ? ': ' : ''}${artists}`
  }

  async getUrl(element: Element): Promise<string | undefined> {
    const anchor = await element.query('a')
    const href = await anchor?.getAttribute('href')
    return new URL(href ?? '', this.BASE_URL).toString()
  }
}

register(new Dachstock())
