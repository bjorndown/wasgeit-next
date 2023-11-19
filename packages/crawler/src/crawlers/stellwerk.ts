import { Page, Element } from '../lib/browser'
import { BrowserBasedCrawler, register } from '../lib/crawler'

class Stellwerk extends BrowserBasedCrawler {
  key = 'stellwerk'
  BASE_URL = 'https://www.stellwerk.be'
  title = 'Stellwerk'
  url = new URL('/', this.BASE_URL).toString()
  city = 'Bern'
  dateFormat = 'EE dd.MM'
  waitMsBeforeCrawl = 1_000

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
}

register(new Stellwerk())
