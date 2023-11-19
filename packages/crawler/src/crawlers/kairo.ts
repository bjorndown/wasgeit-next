import { Page, Element } from '../lib/browser'
import { BrowserBasedCrawler, register } from '../lib/crawler'

class Kairo extends BrowserBasedCrawler {
  key = 'kairo'
  title = 'Kairo'
  url = 'https://www.cafe-kairo.ch'
  city = 'Bern'
  dateFormat = 'dd.MM.yyyy'

  prepareDate(date: string) {
    return date.slice(4, 14)
  }

  getEventElements(page: Page): Promise<Element[]> {
    return page.query('article[id]')
  }

  getStart(element: Element): Promise<string | undefined> {
    return element.childText('p')
  }

  getTitle(element: Element): Promise<string | undefined> {
    return element.childText('h2')
  }

  getUrl(element: Element): Promise<string | undefined> {
    return element.getAttribute('id').then(id => `${this.url}/#${id}`)
  }
}

register(new Kairo())
