import { Element, Page } from '../lib/browser'
import { Crawler, register } from '../lib/crawler'

class Lacapella extends Crawler {
  key = 'lacapella'
  BASE_URL = 'https://www.la-cappella.ch'
  title = 'La Cappella'
  url = new URL('de/spielplan-4.html', this.BASE_URL).toString()
  city = 'Bern'
  dateFormat = "dd. MMMM yyyy HH:mm 'Uhr'"

  async crawl(page: Page) {
    const monthGroups = await this.getEventElements(page)

    const eventsPerMonth = await Promise.all(
      monthGroups.map(async monthGroup => {
        const monthYear = await monthGroup.childText('h2')
        const eventElements = await monthGroup.queryAll('.lc-event')

        return Promise.all(
          eventElements.map(async element => {
            const date = await element.childText('.lc-event__date')
            const time = await element.childText('.lc-event__time')
            const title = await element.childText('.lc-event__text')
            const anchor = await element.query('.lc-event__text')
            const href = await anchor?.getAttribute('href')
            const url = new URL(href ?? '', this.BASE_URL).toString()

            return { start: `${date} ${monthYear} ${time}`, title, url }
          })
        )
      })
    )

    const eventsWithVenue = eventsPerMonth.flat().map(rawEvent => ({
      ...rawEvent,
      venue: `${this.title}, ${this.city}`,
    }))

    return this.postProcess(eventsWithVenue)
  }

  getEventElements(page: Page) {
    return page.query('.eventlist__group')
  }

  getStart(element: Element) {
    return Promise.resolve('')
  }

  getTitle(element: Element) {
    return Promise.resolve('')
  }

  getUrl(element: Element) {
    return Promise.resolve('')
  }
}

register(new Lacapella())
