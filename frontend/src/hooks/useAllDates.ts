import { useEvents } from './useEvents'
import { useMemo } from 'react'
import { isFuture, isToday, parseISO } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'

export const useAllDates = () => {
  const { events, isValidating } = useEvents()
  return useMemo(() => {
    if (isValidating) {
      return []
    }

    return Array.from(
      new Set(
        events
          .map((event) =>
            formatInTimeZone(
              parseISO(event.start),
              'Europe/Zurich',
              'yyyy-MM-dd'
            )
          )
          .filter((date) => isFuture(parseISO(date)) || isToday(parseISO(date)))
      )
    )
  }, [events, isValidating])
}
