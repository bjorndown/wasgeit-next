import puppeteer, { EvaluateFn } from 'puppeteer-core'

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

export class Browser {
  constructor(private browser: puppeteer.Browser) {}

  async openPage(url: string): Promise<Page> {
    const page = await this.browser.newPage()
    await page.goto(url)
    await page.waitForTimeout(2000)
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
    return elements.map((element) => new Element(element))
  }
}


export class Element {
  constructor(private element: puppeteer.ElementHandle) {}

  async getAttribute(attributeName: string): Promise<string> {
    return this.element.evaluate(
      (e, attr) =>
        e.attributes
          .getNamedItem(attr)
          ?.textContent?.trim()
          .replaceAll(/\n/g, '')
          .replaceAll(/[ ]{2,}/g, ' ') ?? '',
      attributeName
    )
  }

  async query(selector: string): Promise<Element | null> {
    const element = await this.element.$(selector)
    return element ? new Element(element) : null
  }

  async queryAll(selector: string): Promise<Element[]> {
    const elements = await this.element.$$(selector)
    return elements.map((element) => new Element(element))
  }

  async textContent(): Promise<string> {
    return this.element.evaluate(
      (e) =>
        e.textContent
          ?.trim()
          .replaceAll(/\n/g, '')
          .replaceAll(/[ ]{2,}/g, ' ') ?? '',
    )
  }

  async childText(selector: string): Promise<string> {
    const element = await this.query(selector)
    return element
      ? await element.evaluate(
          (e) =>
            e.textContent
              ?.trim()
              .replaceAll(/\n/g, '')
              .replaceAll(/[ ]{2,}/g, ' ') ?? '',
        )
      : ''
  }

  async evaluate<T extends EvaluateFn>(fn: T, ...args: any[]) {
    return this.element.evaluate<T>(fn, args)
  }
}
