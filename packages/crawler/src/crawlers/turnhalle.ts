import { Element, Page } from '../lib/browser'
import { Crawler, register } from '../lib/crawler'

class Turnhalle extends Crawler {
  key = 'turnhalle'
  title = 'Turnhalle'
  url = 'https://www.turnhalle.ch'
  city = 'Bern'

  dateFormat = 'dd.MM.yy'

  getTitle(element: Element): Promise<string> {
    return element.childText('h4')
  }

  getStart(element: Element): Promise<string> {
    return element.childText('h2')
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
    return date.replaceAll(' ', '').slice(3, 11)
  }

  onLoad() {
    document.querySelector('.tile.footer')?.scrollIntoView()
  }
}

register(new Turnhalle())
