import { Event } from '@wasgeit/common/src/types'
import { AddToCalendarLink } from './AddToCalendarLink'

export const EventItem = (props: { event: Event; date: string }) => (
  <article className="event" data-start-date={props.event.start}>
    <a className="event-title" href={props.event.url}>
      <h3>{props.event.title}</h3>
    </a>
    <a href={new URL(props.event.url).origin} className="venue-name">
      {props.event.venue}
    </a>
    <AddToCalendarLink date={props.date} event={props.event} />
    <style jsx>{`
      .event-title {
        font-size: var(--medium-font-size);
        width: 100%;
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
        flex-flow: row wrap;
        justify-content: space-between;
        align-items: end;
        column-gap: 3rem;
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
