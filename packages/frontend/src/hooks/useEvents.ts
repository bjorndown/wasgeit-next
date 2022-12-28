import useSWR from 'swr'
import { Event } from '@wasgeit/common/src/types'

export const EVENTS_JSON_URL =
  'https://redcoast.fra1.digitaloceanspaces.com/wasgeit/events.json'

export const useEvents = () => {
  const {
    data: events,
    error,
    isValidating,
  } = useSWR<Event[]>(EVENTS_JSON_URL, {
    fallbackData: [],
    revalidateOnFocus: false,
  })
  return { events, error, isValidating }
}
