import { Element, Page } from '../lib/browser'
import { BrowserBasedCrawler, register } from '../lib/crawler'

class Turnhalle extends BrowserBasedCrawler {
  key = 'turnhalle'
  title = 'Turnhalle'
  url = 'https://www.turnhalle.ch'
  city = 'Bern'

  dateFormat = 'dd.MM.yy'

  getTitle(element: Element): Promise<string> {
    return element.childText('div')
  }

  getStart(element: Element): Promise<string> {
    return element.childText('h4')
  }

  getUrl(element: Element): Promise<string> {
    return element
      .getAttribute('href')
      .then(path => new URL(path, this.url).toString())
  }

  getEventElements(page: Page): Promise<Element[]> {
    return page.query('.event.box > a')
  }

  prepareDate(date: string) {
    const s = date.split('>')[0].replaceAll(' ', '')
    return s.slice(s.length - this.dateFormat.length, s.length)
  }

  onLoad() {
    document.querySelector('.tile.footer')?.scrollIntoView()
  }
}

register(new Turnhalle())
