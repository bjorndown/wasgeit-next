import { Element, Page } from '../lib/browser'
import { BrowserBasedCrawler, register } from '../lib/crawler'

class Muehlehunziken extends BrowserBasedCrawler {
  key = 'muehlehunziken'
  title = 'Mühle Hunziken'
  url = 'https://muehlehunziken.ch/programm'
  city = 'Rubigen'
  dateFormat = 'd.M.'

  async getEventElements(page: Page) {
    return page.query('main ul > li > a.customLink')
  }

  async getTitle(element: Element) {
    return element.childText('div > div:nth-child(2)')
  }

  async getStart(element: Element) {
    return element.childText('div > div:nth-child(1)')
  }

  async getUrl(element: Element) {
    return element.getAttribute('href')
  }

  prepareDate(date: string) {
    return date.slice(3)
  }
}

register(new Muehlehunziken())
