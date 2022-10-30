import { Event } from '@wasgeit/common/src/types'
import { addHours, endOfDay, parseISO } from 'date-fns'

const toIcalDate = (isoString: string): string =>
  isoString
    .replaceAll(/[-:]/g, '')
    .replaceAll('.000', '')
    .replaceAll('.999', '')

export const generateIcalEntry = (event: Event): string => {
  const ical = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//wasgeit.ch//NONSGML v1.0//DE
BEGIN:VEVENT
UID:${crypto.randomUUID()}
DTSTAMP:${toIcalDate(event.start)}
DTSTART:${toIcalDate(event.start)}
DTEND:${toIcalDate(addHours(new Date(event.start), 2).toISOString())}
SUMMARY:${event.title}
LOCATION:${event.venue}
URL:${event.url}
DESCRIPTION:ACHTUNG, Uhrzeit beim Veranstalter prüfen: ${event.url}
END:VEVENT
END:VCALENDAR
`
  return `data:text/calendar;base64,${Buffer.from(ical).toString('base64')}`
}
