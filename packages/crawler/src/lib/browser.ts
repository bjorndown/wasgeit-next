import * as puppeteer from 'puppeteer-core'

export const openBrowser = async (): Promise<Browser> => {
  const browser = await startPuppeteer()
  return new Browser(browser)
}

const startPuppeteer = async (): Promise<puppeteer.Browser> => {
  if (process.env.BROWSER_WS_ENDPOINT) {
    return puppeteer.connect({
      browserWSEndpoint: process.env.BROWSER_WS_ENDPOINT,
    })
  }
  return puppeteer.launch({ executablePath: '/usr/bin/chromium-browser' })
}

export type OpenPageArgs = {
  url: string
  waitMsBeforeCrawl?: number
  onLoad?: () => void
}

class Browser {
  constructor(private browser: puppeteer.Browser) {}

  async openPage({
    url,
    onLoad,
    waitMsBeforeCrawl,
  }: OpenPageArgs): Promise<Page> {
    const page = await this.browser.newPage()
    await page.goto(url)

    if (onLoad) {
      await page.evaluate(onLoad)
    }

    await new Promise(resolve => setTimeout(resolve, waitMsBeforeCrawl ?? 500))

    return new Page(page)
  }

  async close(): Promise<void> {
    return this.browser.close()
  }
}

export class Page {
  constructor(private page: puppeteer.Page) {}

  async query(selector: string): Promise<Element[]> {
    const elements = await this.page.$$(selector)
    return elements.map(element => new Element(element))
  }

  async source(): Promise<string> {
    return this.page.content()
  }
}

export class Element {
  private readonly ZERO_WIDTH_SPACE = '\u200B'

  constructor(protected element: puppeteer.ElementHandle) {}

  async getAttribute(attributeName: string): Promise<string> {
    return this.element.evaluate(
      (element, attr) =>
        element.attributes
          .getNamedItem(attr)
          ?.textContent?.trim() // cannot extract into method because scope is not available in remote browser
          .replaceAll(/[\n\t]+/g, ' ')
          .replaceAll(/ {2,}/g, ' ')
          .replaceAll('\u200B', '') ?? // zero width space
        '',
      attributeName
    )
  }

  async query(selector: string): Promise<Element | null> {
    const element = await this.element.$(selector)
    return element ? new Element(element) : null
  }

  async queryAll(selector: string): Promise<Element[]> {
    const elements = await this.element.$$(selector)
    return elements.map(element => new Element(element))
  }

  async textContent(): Promise<string> {
    const textContent = await this.element.evaluate(
      element => element.textContent
    )
    return this.cleanText(textContent)
  }

  async childText(selector: string): Promise<string> {
    const element = await this.query(selector)
    const innerText = await element?.element.evaluate(
      element => (element as HTMLElement).innerText
    )
    return this.cleanText(innerText)
  }

  cleanText(something: string | undefined | null): string {
    return (
      something
        ?.trim()
        .replaceAll(/[\n\t]+/g, ' ')
        .replaceAll(/ {2,}/g, ' ')
        .replaceAll(this.ZERO_WIDTH_SPACE, '') ?? ''
    )
  }
}
