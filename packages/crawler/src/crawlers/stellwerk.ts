import { Page, Element } from '../lib/browser'
import { Crawler, CrawlResult, RawEvent, register } from '../lib/crawler'

class Stellwerk extends Crawler {
  key = 'stellwerk'
  BASE_URL = 'https://www.stellwerk.be'
  title = 'Stellwerk'
  url = new URL('/', this.BASE_URL).toString()
  city = 'Bern'
  dateFormat = 'EE dd.MM'
  waitMsBeforeCrawl = 1_500

  getEventElements(page: Page): Promise<Element[]> {
    return page.query('article.post > a')
  }

  async getStart(element: Element): Promise<string | undefined> {
    return element.childText('.post__date')
  }

  async getTitle(element: Element): Promise<string | undefined> {
    const title = await element.childText('h2')
    const subTitle = await element.childText('h3')
    return subTitle ? `${title}, ${subTitle}` : title
  }

  async getUrl(element: Element): Promise<string | undefined> {
    const href = await element.getAttribute('href')
    return new URL(href, this.BASE_URL).toString()
  }

  onLoad() {
    document.querySelector<HTMLElement>('.posts__loadmore.loadmore')?.click()
    document.querySelector<HTMLElement>('.posts__loadmore.loadmore')?.click()
  }

  async crawl(page: Page): Promise<CrawlResult> {
    const crawlResult = await super.crawl(page)

    // There is a bug on the site that causes events just before the end of the
    // page to be shown twice after hitting the "load more" button.
    // The workaround is to de-duplicate by title:
    crawlResult.events = crawlResult.events.filter(event => {
      const eventsWithSameTitles = crawlResult.events
        .map((e, i): [number, RawEvent] => [i, e])
        .filter(tuple => tuple[1].title === event.title)
      const isDuplicate =
        eventsWithSameTitles.length > 1 && event !== eventsWithSameTitles[0][1]

      if (isDuplicate) {
        crawlResult.ignored.push({ event, reason: 'duplicated' })
        return false
      }
      return true
    })

    return crawlResult
  }
}

register(new Stellwerk())
