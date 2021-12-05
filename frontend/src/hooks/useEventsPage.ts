import { Event, EventsByDate, ISODate } from '@wasgeit/common/src/types'
import { formatISO, isFuture, isToday, parseISO } from 'date-fns'
import { useMemo } from 'react'
import { useEvents } from './useEvents'

const groupByDate = (events: Event[]): [ISODate, Event[]][] => {
  const eventsByDate: EventsByDate = {}
  events
    .filter(
      (event) =>
        isToday(parseISO(event.start)) || isFuture(parseISO(event.start))
    )
    .map((event) => {
      const eventStart = parseISO(event.start)
      const eventDate = formatISO(eventStart, { representation: 'date' })
      if (!eventsByDate[eventDate]) {
        eventsByDate[eventDate] = []
      }
      eventsByDate[eventDate].push(event)
    })

  return Object.entries(eventsByDate).sort()
}

export const useEventsPage = () => {
  const { events, isValidating } = useEvents()

  const eventsByDate = useMemo(() => {
    if (events) {
      return groupByDate(events)
    }
    return []
  }, [events])

  return { events: eventsByDate, isValidating }
}
