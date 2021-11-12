import { format, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'
import { ISODate, Event } from '@wasgeit/common/src/types'

type Props = {
  date: ISODate
  events: Event[]
}

export const EventsOfTheDay = ({ date, events }: Props) => {
  const formatDateLong = (date: Date) =>
    format(date, 'EEE dd. MMM', { locale: de })

  return (
    <article className="events-of-the-day">
      <h2>{formatDateLong(parseISO(date))}</h2>
      <ul>
        {events.map((event) => (
          <li key={event.url}>
            <a href={event.url}>
              <article className="event" data-start-date={event.start}>
                <span className="venue-name">{event.venue}</span>
                <span className="event-title">{event.title}</span>
              </article>
            </a>
          </li>
        ))}
      </ul>
      <style jsx>{`
        h2 {
          font-size: 1.5rem;
          text-transform: uppercase;
          background-color: var(--invert-bg-color);
          color: var(--invert-color);
          padding: var(--padding) var(--large-padding);
          position: -webkit-sticky; /* Safari */
          position: sticky;
          top: 0;
        }

        h2:first-of-type {
            margin-top: 0;
        }

        span.venue-name {
          font-size: 1.1rem;
          text-transform: uppercase;
        }

        article.events-of-the-day {
        }

        article.event {
          display: flex;
          flex-flow: column wrap;
          margin-bottom: 1.2rem;
          padding: 0 var(--padding);
          word-break: break-word;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
      `}</style>
    </article>
  )
}
