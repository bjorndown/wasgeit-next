import { Element, Page } from '../lib/browser'
import { Crawler, RawEvent, register } from '../lib/crawler'

class Lacapella extends Crawler {
  key = 'lacapella'
  BASE_URL = 'https://www.la-cappella.ch'
  title = 'La Cappella'
  url = new URL('de/spielplan-4.html', this.BASE_URL).toString()
  city = 'Bern'
  dateFormat = "dd. MMMM yyyy HH:mm 'Uhr'"

  protected async getRawEvents(page: Page): Promise<RawEvent[]> {
    const monthGroups = await this.getEventElements(page)

    const eventsPerMonth = await Promise.all(
      monthGroups.map(async monthGroup => {
        const monthYear = await monthGroup.childText('h2')
        const eventElements = await monthGroup.queryAll('.lc-event')

        return Promise.all(
          eventElements.map(async element => {
            const date = await element.childText('.lc-event__date')
            const time = await element.childText('.lc-event__time')
            const title = await this.getTitle(element)
            const url = await this.getUrl(element)
            return { start: `${date} ${monthYear} ${time}`, title, url }
          })
        )
      })
    )

    return eventsPerMonth.flat()
  }

  getEventElements(page: Page) {
    return page.query('.eventlist__group')
  }

  async getStart(element: Element) {
    return ''
  }

  getTitle(element: Element) {
    return element.childText('.lc-event__text')
  }

  async getUrl(element: Element) {
    const anchor = await element.query('.lc-event__text')
    const href = await anchor?.getAttribute('href')
    return new URL(href ?? '', this.BASE_URL).toString()
  }
}

register(new Lacapella())
