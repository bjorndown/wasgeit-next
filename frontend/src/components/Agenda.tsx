import { compareAsc, parseISO } from 'date-fns'
import { EventsOfTheDay } from './EventsOfTheDay'
import { useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { useGroupedEvents } from '../hooks/useGroupedEvents'
import { Spinner } from './Spinner'

type Props = {
  container: Element
}

export const Agenda = ({ container }: Props) => {
  const [scrollerHidden, setScrollerHidden] = useState(true)
  const handlers = useSwipeable({
    onSwipedLeft: () => setScrollerHidden(false),
    onSwipedRight: () => setScrollerHidden(true)
  })
  const { events, isValidating } = useGroupedEvents()

  if (isValidating) {
    return <Spinner />
  }

  return (
    <div {...handlers}>
      {/*<Scroller topDate={topDate} allDates={allDates} hidden={scrollerHidden} onJump={onJump} />*/}
      {events
        .sort(([a], [b]) => compareAsc(parseISO(a), parseISO(b)))
        .map(([date, events]) => (
          <EventsOfTheDay
            key={date}
            date={date}
            events={events}
          />
        ))}
    </div>
  )
}
