import { Event, EventsByDate, ISODate } from '@wasgeit/common/src/types'
import { isFuture, isToday, parseISO } from 'date-fns'
import { useMemo } from 'react'
import { useEvents } from './useEvents'
import { formatInTimeZone } from 'date-fns-tz'

const groupByDate = (events: Event[]): [ISODate, Event[]][] => {
  const eventsByDate: EventsByDate = {}
  events
    .filter(
      (event) =>
        isToday(parseISO(event.start)) || isFuture(parseISO(event.start))
    )
    .map((event) => {
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

  return Object.entries(eventsByDate).sort()
}

export const useGroupedEvents = () => {
  const { events, isValidating } = useEvents()

  const eventsByDate = useMemo(() => {
    if (events) {
      return groupByDate(events)
    }
    return []
  }, [events])

  return { events: eventsByDate, isValidating }
}
