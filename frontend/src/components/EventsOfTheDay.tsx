import { format, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'
import { ISODate, Event } from '@wasgeit/common/src/types'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'

type Props = {
  date: ISODate
  events: Event[]
  container: Element
  onVisible: (date: ISODate, visible: boolean) => void
}

export const EventsOfTheDay = ({
  date,
  events,
  container,
  onVisible,
}: Props) => {
  const { ref, inView, entry } = useInView({
    threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    root: container,
  })

  const formatDateLong = (date: Date) =>
    format(date, 'EEE dd. MMM', { locale: de })

  useEffect(() => {
    const visible = inView && entry?.intersectionRatio > 0.15
    onVisible(date, visible)
  }, [inView, entry])

  return (
    <article
      id={`date-${date}`}
      ref={ref}
      className="events-of-the-day"
      data-day={date}
    >
      <h2>{formatDateLong(parseISO(date))}</h2>
      {events.map((event) => (
        <a key={event.url} href={event.url}>
          <article className="event" data-start-date={event.start}>
            <span className="venue-name">{event.venue}</span>
            <span className="event-title">{event.title}</span>
          </article>
        </a>
      ))}
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
          font-size: var(--large-font-size);
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
      `}</style>
    </article>
  )
}
