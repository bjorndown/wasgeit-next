import { Event } from '@wasgeit/common/src/types'
import { BrowserBasedCrawler } from './crawler'
import { Page, Element } from './browser'

const now = new Date('2022-10-02 10:01:02')
beforeAll(() => {
  jest.useFakeTimers({ now: now })
})

afterAll(() => {
  jest.useRealTimers()
})

class TestCrawler extends BrowserBasedCrawler {
  key = 'test'
  city = ''
  title = 'Test'
  url = ''
  dateFormat: string

  constructor(dateFormat: string) {
    super()
    this.dateFormat = dateFormat
  }

  async getEventElements(page: Page): Promise<Element[]> {
    return []
  }

  async getStart(element: Element): Promise<string | undefined> {
    return undefined
  }

  async getTitle(element: Element): Promise<string | undefined> {
    return undefined
  }

  async getUrl(element: Element): Promise<string | undefined> {
    return undefined
  }
}

describe('processDate', () => {
  it.each([
    ['d.M.yy HH:mm', '9.10.22 15:00', '2022-10-09T13:00:00.000Z'],
    ['ISO', '2022-10-18 11:00', '2022-10-18T09:00:00.000Z'],
  ])(
    'must use format given by crawler (%s) to parse %s',
    (givenFormat, givenDate, expectedDate) => {
      const crawler = new TestCrawler(givenFormat)

      const { start } = crawler.processDate(
        { start: givenDate } as Event,
        now,
        undefined
      )

      expect(start).toBe(expectedDate)
    }
  )

  it('must set event time if not provided by crawler', () => {
    const crawler = new TestCrawler('dd.MM.')

    const { start } = crawler.processDate(
      { start: '03.10.' } as Event,
      now,
      undefined
    )

    expect(start).toBe('2022-10-03T18:00:00.000Z')
  })

  it(`must set year to next year if previous event's date is newer than the event's date`, () => {
    const crawler = new TestCrawler('dd.MM')

    const { start } = crawler.processDate(
      { start: '11.10' } as Event,
      now,
      new Date('2022-12-31 18:00:00Z')
    )

    expect(start).toBe('2023-10-11T18:00:00.000Z')
  })

  it.each([[new Date('2022-10-09 18:00:00Z')], [undefined]])(
    `must not change year if previous event's date is before the event's date or undefined`,
    previousDate => {
      const crawler = new TestCrawler('dd.MM')

      const { start } = crawler.processDate(
        { start: '10.10' } as Event,
        now,
        previousDate
      )

      expect(start).toBe('2022-10-10T18:00:00.000Z')
    }
  )
})
