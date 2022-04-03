import { compareAsc, parseISO } from 'date-fns'
import { EventsOfTheDay } from './EventsOfTheDay'
import { useMemo, useState } from 'react'
import { Scroller } from './Scroller'
import { useAllDates } from '../hooks/useAllDates'
import { useSwipeable } from 'react-swipeable'
import { useGroupedEvents } from '../hooks/useGroupedEvents'
import { Spinner } from './Spinner'
import { ISODate } from '@wasgeit/common/src/types'

type Props = {
  container: Element
}

const BUFFER_SIZE = 10

export const Agenda = ({ container }: Props) => {
  const [scrollerHidden, setScrollerHidden] = useState(true)
  const handlers = useSwipeable({
    onSwipedLeft: () => setScrollerHidden(false),
    onSwipedRight: () => setScrollerHidden(true),
  })
  const allDates = useAllDates()
  const { events, isValidating } = useGroupedEvents()
  const [visibleDates, setVisibleDates] = useState<ISODate[]>([])
  const topDate = useMemo(() => {
    return visibleDates[0]
  }, [visibleDates])

  const eventsPage = useMemo(() => {
    if (events.length === 0) {
      return []
    }

    const topDateIndex = events.map((entry) => entry[0]).indexOf(topDate)

    const start = topDateIndex > BUFFER_SIZE ? topDateIndex - BUFFER_SIZE : 0
    const end =
      topDateIndex + BUFFER_SIZE > events.length
        ? events.length - 1
        : topDateIndex + BUFFER_SIZE
    return events.slice(start, end)
  }, [topDate, events])

  if (isValidating) {
    return <Spinner />
  }

  const onVisible = (date: ISODate, visible: boolean) => {
    if (!visible) {
      setVisibleDates((prev) => {
        const s = new Set(prev)
        s.delete(date)
        return Array.from(s).sort()
      })
    } else {
      setVisibleDates((prev) => {
        const s = new Set(prev)
        s.add(date)
        return Array.from(s).sort()
      })
    }
  }

  return (
    <div {...handlers}>
      <Scroller topDate={topDate} allDates={allDates} hidden={scrollerHidden} />
      {eventsPage
        .sort(([a], [b]) => compareAsc(parseISO(a), parseISO(b)))
        .map(([date, events]) => (
          <EventsOfTheDay
            onVisible={onVisible}
            key={date}
            date={date}
            events={events}
            container={container}
          />
        ))}
    </div>
  )
}
