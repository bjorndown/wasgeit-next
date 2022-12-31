import { Page, Element } from '../lib/browser'
import { Crawler, register } from '../lib/crawler'

class Bierhuebeli extends Crawler {
  key = 'bierhuebeli'
  title = 'Bierhübeli'
  url = 'https://bierhuebeli.ch'
  city = 'Bern'
  dateFormat = 'dd.MM.yyyy'

  prepareDate(date: string) {
    return date.slice(6)
  }

  getEventElements(page: Page): Promise<Element[]> {
    return page.query('article.event.size_1x1')
  }

  getStart(element: Element): Promise<string | undefined> {
    return element.childText('.event_date')
  }

  getTitle(element: Element): Promise<string | undefined> {
    return element.childText('.event_titles')
  }

  getUrl(element: Element): Promise<string | undefined> {
    return element
      .query('.w-grid-item-anchor')
      .then(element => element?.getAttribute('href'))
  }
}

register(new Bierhuebeli())
