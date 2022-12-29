import { Page, Element } from '../lib/browser'
import { Crawler, register } from '../lib/crawler'

class Kairo extends Crawler {
  name = 'Kairo'
  url = 'https://www.cafe-kairo.ch/kultur'
  city = 'Bern'
  dateFormat = 'EEE dd.MM.yyyy'

  prepareDate(date: string) {
    return date.slice(0, 13)
  }

  getEventElements(page: Page): Promise<Element[]> {
    return page.query('article[id]')
  }

  getStart(element: Element): Promise<string | undefined> {
    return element.childText('p')
  }

  getTitle(element: Element): Promise<string | undefined> {
    return element.childText('h1')
  }

  getUrl(element: Element): Promise<string | undefined> {
    return element.getAttribute('id').then(id => `${this.url}/#${id}`)
  }
}

register(new Kairo())
