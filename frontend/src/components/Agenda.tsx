import { EventsOfTheDay } from './EventsOfTheDay'
import { useGroupedEvents } from '../hooks/useGroupedEvents'
import { Spinner } from './Spinner'
import { NoResults } from './NoResults'

type Props = {
  searchString: string
}

export const Agenda = ({ searchString }: Props) => {
  const { events, isValidating } = useGroupedEvents(searchString)

  if (isValidating) {
    return <Spinner />
  }

  if (events.length === 0) {
    return <NoResults />
  }

  return (
    <>
      {events.map(([date, events]) => (
        <EventsOfTheDay key={date} date={date} events={events} />
      ))}
    </>
  )
}
