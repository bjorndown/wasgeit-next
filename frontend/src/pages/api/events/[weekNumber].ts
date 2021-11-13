import { Event, EventsByDate } from '@wasgeit/common/src/types'
import fs from 'fs'
import { format, formatISO, parseISO } from 'date-fns'
import { NextApiHandler } from 'next'

const { events: allEvents }: { events: Event[] } = JSON.parse(
  fs.readFileSync('./public/events.json').toString()
)

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

const eventsPerWeek = groupByCalendarWeek(allEvents)

const handler: NextApiHandler = async (req, res) => {
  let weekNumber = Array.isArray(req.query.weekNumber)
    ? req.query.weekNumber[0]
    : req.query.weekNumber
  if (eventsPerWeek[weekNumber]) {
    return res.json(eventsPerWeek[weekNumber])
  }
  return res.status(404).end()
}

export default handler
