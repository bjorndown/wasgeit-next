import { compareAsc, formatISO, parseISO } from 'date-fns'
import { EventsOfTheDay } from './EventsOfTheDay'
import { useEffect, useMemo, useState } from 'react'
import { Scroller } from './Scroller'
import { useAllDates } from '../hooks/useAllDates'
import { useSwipeable } from 'react-swipeable'
import { useGroupedEvents } from '../hooks/useGroupedEvents'
import { Spinner } from './Spinner'
import { ISODate } from '@wasgeit/common/src/types'
import { useRouter } from 'next/router'

type Props = {
  container: Element
}

export const Agenda = ({ container }: Props) => {
  const [scrollerHidden, setScrollerHidden] = useState(true)
  const handlers = useSwipeable({
    onSwipedLeft: () => setScrollerHidden(false),
    onSwipedRight: () => setScrollerHidden(true),
  })
  const [topDate, setTopDate] = useState<ISODate>()
  const allDates = useAllDates()
  const { events, isValidating } = useGroupedEvents()
  const router = useRouter()
  const [visibleDates, setVisibleDates] = useState<ISODate[]>([])

  useEffect(() => {
    if (router.isReady) {
      const top = Array.isArray(router.query.top)
        ? router.query.top[0]
        : router.query.top
      if (top) {
        setTopDate(top)
        setTimeout(() => document.querySelector(`#date-${top}`).scrollTo(), 100)
      } else {
        setTopDate(formatISO(new Date(), { representation: 'date' }))
      }
    }
  }, [router.query])

  useEffect(() => {
    setTopDate(visibleDates[0])
  }, [visibleDates])

  const eventsPage = useMemo(() => {
    if (events.length === 0) {
      return []
    }

    const topDateIndex = events.map((entry) => entry[0]).indexOf(topDate)
    const start = topDateIndex > 3 ? topDateIndex - 3 : 0
    const end =
      topDateIndex + 3 > events.length ? events.length - 1 : topDateIndex + 3
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
