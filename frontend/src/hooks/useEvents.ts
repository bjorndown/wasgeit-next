import useSWR from 'swr'
import { Event } from '@wasgeit/common/src/types'

export const useEvents = () => {
  const {
    data: events,
    error,
    isValidating,
  } = useSWR<Event[]>(
    'https://redcoast.fra1.digitaloceanspaces.com/wasgeit/events.json',
    {
      fallbackData: [],
    }
  )
  return { events, error, isValidating }
}
