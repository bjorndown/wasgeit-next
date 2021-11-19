import { compareAsc, parseISO } from 'date-fns'
import { EventsOfTheDay } from './EventsOfTheDay'
import { EventsByDate } from '@wasgeit/common/src/types'

type Props = {
  events: EventsByDate
}

export const Agenda = ({ events }: Props) => {
  return (
    <>
      {Object.entries(events)
        .sort(([a], [b]) => compareAsc(parseISO(a), parseISO(b)))
        .map(([date, events]) => (
          <EventsOfTheDay key={date} date={date} events={events} />
        ))}
    </>
  )
}
