import { Event, EventsByDate } from '@wasgeit/common/src/types'
import { format, formatISO, parseISO } from 'date-fns'
import { useEffect, useState } from 'react'
import { useEvents } from './useEvents'

type EventsByWeekAndDate = Record<string, EventsByDate>

const groupByCalendarWeek = (events: Event[]): EventsByWeekAndDate => {
  const eventsByWeek: EventsByWeekAndDate = {}
  events.map((event) => {
    const eventStart = parseISO(event.start)
    const eventDate = formatISO(eventStart, { representation: 'date' })
    const calendarWeek = format(eventStart, 'yyyy-II')
    if (!eventsByWeek[calendarWeek]) {
      eventsByWeek[calendarWeek] = {}
    }
    if (!eventsByWeek[calendarWeek][eventDate]) {
      eventsByWeek[calendarWeek][eventDate] = []
    }
    eventsByWeek[calendarWeek][eventDate].push(event)
  })
  return eventsByWeek
}

export const useEventsByWeek = (weekYear: string | undefined) => {
  const { events, isValidating } = useEvents()
  const [eventsByWeek, setEventsByWeek] = useState<EventsByWeekAndDate>({})

  useEffect(() => {
    if (events) {
      setEventsByWeek(groupByCalendarWeek(events))
    }
  }, [events])

  return { events: eventsByWeek[weekYear] ?? {}, isValidating }
}
