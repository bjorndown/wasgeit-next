import { Event, EventsByDate, ISODate } from '@wasgeit/common/src/types'
import { compareAsc, isFuture, isToday, parseISO } from 'date-fns'
import { useMemo } from 'react'
import { useEvents } from './useEvents'
import { formatInTimeZone } from 'date-fns-tz'

export const groupAndFilter = (
  events: Event[],
  limit: number,
  searchString: string | null | undefined
): [ISODate, Event[]][] => {
  const eventsByDate: EventsByDate = {}
  events
    .filter(event => {
      const eventStart = parseISO(event.start) // TODO parse date ONCE
      const dateOk = isToday(eventStart) || isFuture(eventStart)

      if (searchString) {
        const lowerCasedSearchString = searchString.toLowerCase()
        const containsString =
          event.title.toLowerCase().includes(lowerCasedSearchString) ||
          event.venue.toLowerCase().includes(lowerCasedSearchString)

        return dateOk && containsString
      }

      return dateOk
    })
    .map(event => {
      const eventStart = parseISO(event.start)
      const eventDate = formatInTimeZone(
        eventStart,
        'Europe/Zurich',
        'yyyy-MM-dd'
      )
      if (!eventsByDate[eventDate]) {
        eventsByDate[eventDate] = []
      }
      eventsByDate[eventDate].push(event)
    })

  return Object.entries(eventsByDate)
    .sort(([date1], [date2]) => compareAsc(parseISO(date1), parseISO(date2)))
    .slice(0, limit)
}

export const useGroupedEvents = (
  limit: number,
  searchString: string | null | undefined
) => {
  const { events, isValidating, error } = useEvents()

  const eventsByDate = useMemo(
    () => (events ? groupAndFilter(events, limit, searchString) : []),
    [events, searchString, limit]
  )

  return { events: eventsByDate, isValidating, error }
}
