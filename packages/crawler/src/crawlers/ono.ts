import { Page, Element } from '../lib/browser'
import { Crawler, register } from '../lib/crawler'

// The wordpress plugin (probably https://plugins.trac.wordpress.org/browser/eventon-lite?order=name)
// outputs dates where the month or day are not zero-padded, which is not a valid ISO 8601 date
export const fixUnpaddedMonthAndDay = (date: string): string => {
  const [[year], [month], [day, time]] = date
    .split('-')
    .map(token => token.split('T'))
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${time}`
}

class Ono extends Crawler {
  key = 'ono'
  title = 'Ono'
  url = 'https://www.onobern.ch/homepage/'
  city = 'Bern'

  prepareDate(date: string): string {
    if (date.length !== 22) {
      return fixUnpaddedMonthAndDay(date)
    }
    return date
  }

  getEventElements(page: Page): Promise<Element[]> {
    return page.query('.eventon_list_event.scheduled.event')
  }

  async getStart(element: Element): Promise<string | undefined> {
    const meta = await element.query('meta[itemprop=startDate]')
    return meta?.getAttribute('content')
  }

  async getTitle(element: Element): Promise<string | undefined> {
    return element.childText('.evcal_event_title')
  }

  async getUrl(element: Element): Promise<string | undefined> {
    const meta = await element.query('a[itemprop=url]')
    return meta?.getAttribute('href')
  }
}

register(new Ono())
