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
        span.venue-name {
          font-size: 1.1rem;
          text-transform: uppercase;
        }
        article.events-of-the-day {
          padding: 0 0.5rem;
        }

        article.event {
          display: flex;
          flex-flow: column wrap;
          margin-bottom: 1.2rem;
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
