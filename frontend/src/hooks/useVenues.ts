import { useEvents } from './useEvents'
import { useEffect, useState } from 'react'

export const useVenues = () => {
  const { events } = useEvents()
  const [venues, setVenues] = useState<string[]>([])

  useEffect(() => {
    const venues = events.reduce((venues, event) => {
      venues.add(event.venue)
      return venues
    }, new Set<string>())

    setVenues(Array.from(venues.values()))
  }, [events])

  return { venues }
}
