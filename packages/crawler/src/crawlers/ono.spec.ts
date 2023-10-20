import { fixUnpaddedMonthAndDay } from './ono'
import { isValid, parseISO } from 'date-fns'

describe('fixUnpaddedMonthAndDay', () => {
  it.each([
    ['2024-5-16T20:00+2:00', '2024-05-16T20:00+2:00'],
    ['2024-4-2T19:00+2:00', '2024-04-02T19:00+2:00'],
    ['2024-10-3T20:00+2:00', '2024-10-03T20:00+2:00'],
  ])('must fix invalid date "%s"', (invalidDate, expectedDate) => {
    const fixedDate = fixUnpaddedMonthAndDay(invalidDate)
    expect(fixedDate).toBe(expectedDate)
    expect(isValid(parseISO(fixedDate))).toBe(true)
  })
  it.each([['2023-12-10T20:00+2:00']])(
    'must not touch valid date "%s"',
    validDate => {
      expect(fixUnpaddedMonthAndDay(validDate)).toBe(validDate)
      expect(isValid(parseISO(validDate))).toBe(true)
    }
  )
})
