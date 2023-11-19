import { Page, Element } from '../lib/browser'
import { BrowserBasedCrawler, register } from '../lib/crawler'

class Kiff extends BrowserBasedCrawler {
  key = 'kiff'
  BASE_URL = 'https://www.kiff.ch'
  title = 'Kiff'
  url = new URL('/de/home.html?view=list', this.BASE_URL).toString()
  city = 'Aarau'
  dateFormat = 'dd MMM'

  prepareDate(date: string) {
    return date.replace('\n', '').trim().slice(3, 9)
  }

  getEventElements(page: Page): Promise<Element[]> {
    return page.query('.programm-grid.listview a')
  }

  getStart(element: Element): Promise<string | undefined> {
    return element.childText('.event-date')
  }

  getTitle(element: Element): Promise<string | undefined> {
    return element.getAttribute('title')
  }

  getUrl(element: Element): Promise<string | undefined> {
    return element
      .getAttribute('href')
      .then(path => new URL(path, this.BASE_URL).toString())
  }
}

register(new Kiff())
