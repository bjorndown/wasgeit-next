import { CrawlResult, register } from '../lib/crawler'
import { ISODateTime, Event } from '@wasgeit/common/src/types'

type WordPressEvent = {
  title: string
  acf: {
    start: ISODateTime
    end: ISODateTime
    title: string
    text: string
    series: false
  }
  meta: {
    title: string
  }
  uri: string
}

class Dachstock {
  key = 'dachstock'
  BASE_URL = 'https://www.dachstock.ch'
  title = 'Dachstock'
  url = new URL('/events', this.BASE_URL).toString()
  city = 'Bern'
  dateFormat = 'dd.MM.yyyy - HH:mm'

  get venue(): string {
    return `${this.title}, ${this.city}`
  }

  async crawl(): Promise<CrawlResult> {
    const response = await fetch(
      'https://api.dachstock.ch/wp-json/wp/v2/event?preset=future&per_page=25&acf_format=standard&date_filter='
    )
    if (response.ok) {
      const rawEvents: WordPressEvent[] = await response.json()
      const events: Event[] = rawEvents.map(event => {
        return {
          title: event.meta.title,
          start: event.acf.start,
          end: event.acf.end,
          venue: this.venue,
          url: new URL(event.uri, this.url).toString(),
        }
      })
      return { key: this.key, broken: [], events, ignored: [] }
    }
    throw new Error(
      `crawling dachstock failed: ${response.status} ${response.statusText}`
    )
  }
}

register(new Dachstock())
