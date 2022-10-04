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
      <>
        <h2>leider</h2>
        <style jsx>{`
          h2 {
            color: var(--color);
            padding: 0 var(--large-padding);
          }
        `}</style>
      </>
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
