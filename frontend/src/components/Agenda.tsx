import { EventsOfTheDay } from './EventsOfTheDay'
import { useGroupedEvents } from '../hooks/useGroupedEvents'
import { Spinner } from './Spinner'
import { NoResults } from './NoResults'
import { useEffect, useRef, useState } from 'react'

type Props = {
  searchString: string
}

export const Agenda = ({ searchString }: Props) => {
  const [limit, setLimit] = useState(10)
  const { events, isValidating } = useGroupedEvents(limit, searchString)
  const ref = useRef(null)
  const io = useRef<IntersectionObserver>(null)

  useEffect(() => {
    io.current = new IntersectionObserver(entries => {
      if (entries[0].intersectionRatio > 0.0) {
        setLimit(currentLimit => currentLimit + 20)
      }
    })
  }, [])

  useEffect(() => {
    if (io.current && ref.current) {
      io.current.observe(ref.current)
      return () => io.current.disconnect()
    }
  }, [io.current, ref.current])

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
      {limit <= events.length && <span ref={ref}>...</span>}
    </>
  )
}
