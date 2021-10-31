import puppeteer from 'puppeteer'
import { Event } from '@wasgeit/common/src/types'
import fs from 'fs'
import path from 'path'
import crawlers from './crawlers/index'
import { EvaluateFn } from 'puppeteer'

export type Crawler = {
  name: string
  url: string
  crawl: (page: Page) => Promise<Event[]>
  postProcess: (events: Event[]) => Event[]
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
    attributeName)
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

const main = async () => {
  const browser = await puppeteer.launch()

  for await (const crawler of crawlers) {
    try {
      const page = await browser.newPage()
      await page.goto(crawler.url)
      await page.waitForTimeout(5000)
      const rawEvents = await crawler.crawl(new Page(page))
      const events = crawler.postProcess(rawEvents)
      console.log(events)
    } catch (error) {
      console.error(error)
    }
  }

  browser.close()
}

main()
