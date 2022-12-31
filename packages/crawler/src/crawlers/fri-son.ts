import { Page, Element } from '../lib/browser'
import { Crawler, register } from '../lib/crawler'

class FriSon extends Crawler {
  key = 'fri-son'
  BASE_URL = 'https://fri-son.ch'
  title = 'Fri-Son'
  url = new URL('/de/programm', this.BASE_URL).toString()
  city = 'Fribourg'

  getEventElements(page: Page): Promise<Element[]> {
    return page.query('.node.node-event')
  }

  getStart(element: Element): Promise<string | undefined> {
    return element
      .query('.date-display-single')
      .then(el => el?.getAttribute('content'))
  }

  getTitle(element: Element): Promise<string | undefined> {
    return element.childText('.field.field-name-field-event-artists')
  }

  getUrl(element: Element): Promise<string | undefined> {
    return element
      .getAttribute('about')
      .then(attr => new URL(attr, this.BASE_URL).toString())
  }

  onLoad() {
    document.querySelector('.block.block-block.last.odd')?.scrollIntoView()
  }
}

register(new FriSon())
