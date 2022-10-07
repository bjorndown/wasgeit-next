import { Event, ISODate } from '@wasgeit/common/src/types'
import { format, formatISO, isSameYear, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'
import { generateIcalEntry } from '../lib/ical'

type Props = {
  date: ISODate
  events: Event[]
}

export const EventsOfTheDay = ({ date, events }: Props) => {
  const formatDateLong = (date: Date) => {
    if (isSameYear(new Date(), date)) {
      return format(date, 'EEE dd. MMMM', { locale: de })
    } else {
      return format(date, 'EEE dd. MMMM yyyy', { locale: de })
    }
  }

  return (
    <article id={`date-${date}`} className="events-of-the-day" data-day={date}>
      <h2>{formatDateLong(parseISO(date))}</h2>
      {events.map((event) => (
        <article
          className="event"
          data-start-date={event.start}
          key={event.url}
        >
          <a key={event.url} href={event.url}>
            <h3 className="event-title">{event.title}</h3>
          </a>
          <a href={new URL(event.url).origin} className="venue-name">
            {event.venue}
          </a>
          <a
            href={generateIcalEntry(event)}
            download={`${event.start}-${event.venue}.ics`}
            type="text/calendar"
            className="calendar-entry"
          >
            grad ischribe!
          </a>
        </article>
      ))}

      <style jsx>{`
        .calendar-entry {
          font-size: 1.1rem;
          align-self: flex-end;
        }

        h2 {
          font-size: var(--medium-font-size);
          text-transform: uppercase;
          background-color: var(--invert-bg-color);
          color: var(--invert-color);
          padding: var(--padding) var(--large-padding);
          position: -webkit-sticky; /* Safari */
          position: sticky;
          top: 0;
        }

        h3 {
          font-size: var(--medium-font-size);
        }

        .venue-name {
          font-size: var(--small-font-size);
          text-transform: uppercase;
        }

        .events-of-the-day {
          font-size: var(--large-font-size);
        }

        .event {
          border-left: medium solid var(--color);
          display: flex;
          flex-flow: column wrap;
          margin-bottom: var(--xl-padding);
          padding: 0 var(--large-padding);
          word-break: break-word;
        }

        .event:first-of-type {
          margin-top: var(--xl-padding);
        }
      `}</style>
    </article>
  )
}
