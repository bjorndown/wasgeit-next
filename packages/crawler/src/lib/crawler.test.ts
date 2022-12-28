import { Event } from '@wasgeit/common/src/types'
import { Crawler, processDate } from './crawler'

jest.mock('./slack', () => {
  notifySlack: jest.fn()
})


const now = new Date('2022-10-02 10:01:02')
beforeAll(() => {
  jest.useFakeTimers({ now: now })
})

afterAll(() => {
  jest.useRealTimers()
})

describe('processDate', () => {
  it.each([
    ['d.M.yy HH:mm', '9.10.22 15:00', '2022-10-09T13:00:00.000Z'],
    ['ISO', '2022-10-18 11:00', '2022-10-18T09:00:00.000Z']
  ])('must use format given by crawler (%s) to parse %s', (givenFormat, givenDate, expectedDate) => {
    const crawler = {
      providesTime: true,
      prepareDate: (_: string) => [givenDate, givenFormat]
    } as Crawler

    const { start } = processDate({} as Event, crawler, now, undefined)

    expect(start).toBe(expectedDate)
  })

  it('must set event time if not provided by crawler', () => {
    const crawler = {
      providesTime: false,
      prepareDate: (_: string) => ['03.10.', 'dd.MM.']
    } as Crawler

    const { start } = processDate({} as Event, crawler, now, undefined)

    expect(start).toBe('2022-10-03T18:00:00.000Z')
  })

  it(`must set year to next year if previous event's date is newer than the event's date`,
    () => {
      const crawler = {
        prepareDate: (_: string) => ['11.10', 'dd.MM']
      } as Crawler

      const { start } = processDate({} as Event, crawler, now, new Date('2022-12-31 18:00:00Z'))

      expect(start).toBe('2023-10-11T18:00:00.000Z')
    }
  )

  it.each([
    [new Date('2022-10-09 18:00:00Z')],
    [undefined]]
  )(`must not change year if previous event's date is before the event's date or undefined`,
    (previousDate) => {
      const crawler = {
        prepareDate: (_: string) => ['10.10', 'dd.MM']
      } as Crawler

      const { start } = processDate({} as Event, crawler, now, previousDate)

      expect(start).toBe('2022-10-10T18:00:00.000Z')
    }
  )
})
