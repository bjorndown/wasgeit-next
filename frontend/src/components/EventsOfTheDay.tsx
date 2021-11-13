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
      {/* language=css*/}
      <style jsx>{`
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

        span.venue-name {
          font-size: var(--small-font-size);
          text-transform: uppercase;
        }

        article.events-of-the-day {
        }

        article.event {
          display: flex;
          flex-flow: column wrap;
          margin-bottom: var(--xl-padding);
          padding: 0 var(--large-padding);
          word-break: break-word;
        }

        article.event:first-of-type {
          margin-top: var(--xl-padding);
        }

        ul {
          list-style: none;
        }
      `}</style>
    </article>
  )
}
