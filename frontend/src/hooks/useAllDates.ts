import { useEvents } from './useEvents'
import { useMemo } from 'react'
import { formatISO, isFuture, isToday, parseISO } from 'date-fns'

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
            formatISO(parseISO(event.start), { representation: 'date' })
          )
          .filter((date) => isFuture(parseISO(date)) || isToday(parseISO(date)))
      )
    )
  }, [events, isValidating])
}
