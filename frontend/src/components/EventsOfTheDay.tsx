import { Event, ISODate } from '@wasgeit/common/src/types'
import { format, isSameYear, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'
import { EventItem } from './EventItem'

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
      {events.map(event => (
        <EventItem key={event.url} event={event} date={date} />
      ))}
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
      `}</style>
    </article>
  )
}
