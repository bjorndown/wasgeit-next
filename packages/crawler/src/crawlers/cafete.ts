import { Page, Element } from '../lib/browser'
import { Crawler, register } from '../lib/crawler'

class Cafete extends Crawler {
  key = 'cafete'
  title = 'Cafete'
  url = 'https://cafete.ch/'
  city = 'Bern'
  dateFormat = "dd. MMMM yyyy HH'h'mm"

  prepareDate(date: string) {
    return date.replace(' — Doors:', '').slice(3, 25)
  }

  getEventElements(page: Page): Promise<Element[]> {
    return page.query('.event')
  }

  getStart(element: Element): Promise<string | undefined> {
    return element.childText('.date')
  }

  async getTitle(element: Element): Promise<string | undefined> {
    const title = await element.childText('.title')
    const acts = await element.childText('.acts')
    return `${title} ${acts}`
  }

  async getUrl(element: Element): Promise<string | undefined> {
    return this.url
  }
}

register(new Cafete())