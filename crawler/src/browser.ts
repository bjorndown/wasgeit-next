import puppeteer, { EvaluateFn } from 'puppeteer'

export const openBrowser = async (): Promise<Browser> => {
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/vivaldi' })
  return new Browser(browser)
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
      (e, attr) => e.attributes.getNamedItem(attr)?.textContent?.trim() ?? '',
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
    return this.element.evaluate((e) => e.textContent?.trim() ?? '')
  }

  async childText(selector: string): Promise<string> {
    const element = await this.query(selector)
    return element
      ? (await element.evaluate((e) => e.textContent?.trim())) ?? ''
      : ''
  }

  async evaluate<T extends EvaluateFn>(fn: T, ...args: any[]) {
    return this.element.evaluate<T>(fn, args)
  }
}
