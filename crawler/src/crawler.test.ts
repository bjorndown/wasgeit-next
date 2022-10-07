import { Event } from '@wasgeit/common/src/types'
import { Crawler, processDate } from './crawler'

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
    ['ISO', '2022-10-18 11:00', '2022-10-18T09:00:00.000Z'],
  ])('must use format given by crawler (%s) to parse %s', (givenFormat, givenDate, expectedDate) => {
    const crawler = {
      providesTime: true,
      prepareDate: (_: string) => [givenDate, givenFormat],
    } as Crawler

    const { start } = processDate({} as Event, crawler, now)

    expect(start).toBe(expectedDate)
  })

  it('must set event time if not provided by crawler', () => {
    const crawler = {
      providesTime: false,
      prepareDate: (_: string) => ['03.10.', 'dd.MM.'],
    } as Crawler

    const { start } = processDate({} as Event, crawler, now)

    expect(start).toBe('2022-10-03T18:00:00.000Z')
  })

  it.each([
    ['01.10', '2023-10-01T18:00:00.000Z'],
    ['01.09', '2023-09-01T18:00:00.000Z'],
  ])(
    `must move event at %s to next year if crawler runs ${now.toISOString()}`,
    (givenDate, expectedDate) => {
      const crawler = {
        prepareDate: (_: string) => [givenDate, 'dd.MM'],
      } as Crawler

      const { start } = processDate({} as Event, crawler, now)

      expect(start).toBe(expectedDate)
    }
  )
})
