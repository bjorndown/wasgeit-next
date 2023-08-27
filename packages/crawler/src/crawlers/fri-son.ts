import { Page, Element } from '../lib/browser'
import { Crawler, register } from '../lib/crawler'

class FriSon extends Crawler {
  key = 'fri-son'
  BASE_URL = 'https://fri-son.ch'
  title = 'Fri-Son'
  url = new URL('/de/program', this.BASE_URL).toString()
  city = 'Fribourg'

  getEventElements(page: Page): Promise<Element[]> {
    return page.query('article.node--type-event')
  }

  async getStart(element: Element): Promise<string | undefined> {
    const el = await element.query('time')
    return el?.getAttribute('datetime')
  }

  getTitle(element: Element): Promise<string | undefined> {
    return element.childText('.content-wrapper')
  }

  async getUrl(element: Element): Promise<string | undefined> {
    const anchor = await element.query('a')
    const path = (await anchor?.getAttribute('href')) ?? ''
    return new URL(path, this.BASE_URL).toString()
  }
}

register(new FriSon())
