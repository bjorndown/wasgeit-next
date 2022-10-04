import { EventsOfTheDay } from './EventsOfTheDay'
import { useGroupedEvents } from '../hooks/useGroupedEvents'
import { Spinner } from './Spinner'

type Props = {
  searchString: string
}

export const Agenda = ({ searchString }: Props) => {
  const { events, isValidating } = useGroupedEvents(searchString)

  if (isValidating) {
    return <Spinner />
  }

  if (events.length === 0) {
    return (
      <div className="container">
        <h2>
          Da geht nichts. <br />
          Versuch einen anderen Suchbegriff.
        </h2>
        <style jsx>{`
          .container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100vh;
            text-align: center;
          }

          h2 {
            color: var(--color);
            padding: 0 var(--large-padding);
          }
        `}</style>
      </div>
    )
  }

  return (
    <>
      {events.map(([date, events]) => (
        <EventsOfTheDay key={date} date={date} events={events} />
      ))}
    </>
  )
}
