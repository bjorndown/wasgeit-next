import { Event } from '@wasgeit/common/src/types'
import { groupAndFilter } from './useGroupedEvents'
import { afterAll, beforeAll } from '@jest/globals'

beforeAll(() => {
  jest.useFakeTimers({ now: new Date('2022-10-02') })
})

afterAll(() => {
  jest.useRealTimers()
})

const date = '2022-10-04'
const events: Event[] = [
  { venue: 'fancy', title: 'good stuff', start: date, url: 'url' },
  {
    venue: 'fancy',
    title: 'also good stuff',
    start: date,
    url: 'url',
  },
]

describe('groupAndFilter', () => {
  it('must filter out passed events', () => {
    const events: Event[] = [
      { venue: 'fancy', title: 'good stuff', start: '2022-10-01', url: 'url' },
    ]

    const grouped = groupAndFilter(events, undefined)

    expect(grouped).toStrictEqual([])
  })
  it('must group of events by date', () => {
    const grouped = groupAndFilter(events, undefined)

    expect(grouped).toStrictEqual([[date, events]])
  })
  it('must filter out events not containing searchString', () => {
    const grouped = groupAndFilter(events, 'ALSO')

    expect(grouped).toStrictEqual([[date, [events[1]]]])
  })
})
