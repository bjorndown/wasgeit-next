import useSWR from 'swr'
import { Event } from '@wasgeit/common/src/types'

export const useEvents = () => {
  const {
    data: events,
    error,
    isValidating,
  } = useSWR<Event[]>(
    'https://wasgeit.eu-central-1.linodeobjects.com/events.json',
    {
      fallbackData: [],
    }
  )
  return { events, error, isValidating }
}
