import { Page, Element } from '../lib/browser'
import { Crawler, register } from '../lib/crawler'

class Bierhuebeli extends Crawler {
  key = 'bierhuebeli'
  title = 'Bierhübeli'
  url = 'https://bierhuebeli.ch'
  city = 'Bern'
  dateFormat = 'dd.MM.yy'

  prepareDate(date: string) {
    return date.slice(6)
  }

  getEventElements(page: Page): Promise<Element[]> {
    return page.query('.datumlink')
  }

  getStart(element: Element): Promise<string | undefined> {
    return element.childText('.eventdatum')
  }

  async getTitle(element: Element): Promise<string | undefined> {
    const title = await element.childText('.eventtitel')
    const byline = await element.childText('.byline')
    return byline ? `${title} - ${byline}` : title
  }

  getUrl(element: Element): Promise<string | undefined> {
    return element.getAttribute('href')
  }
}

register(new Bierhuebeli())
