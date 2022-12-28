import { Event, ISODate } from '@wasgeit/common/src/types'
import { generateIcalEntry } from '../lib/ical'

type Props = {
  date: ISODate
  event: Event
}

export const AddToCalendarLink = ({ date, event }: Props) => (
  <>
    <a
      href={generateIcalEntry(event)}
      download={`${date}-${event.venue.replace(', ', '-')}.ics`}
      type="text/calendar"
      className="calendar-entry"
      title="Kalendereintrag herunterladen"
    >
      ischribe
    </a>
    <style jsx>{`
      .calendar-entry {
        font-size: medium;
        color: var(--color);
        border: 1px solid var(--color);
        padding: 0.2rem 0.33rem;
      }
    `}</style>
  </>
)
