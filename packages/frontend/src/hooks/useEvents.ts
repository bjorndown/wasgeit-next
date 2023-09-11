import useSWR from 'swr'
import { Event } from '@wasgeit/common/src/types'
import { EVENTS_JSON_URL } from '@wasgeit/common/src/constants'

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
