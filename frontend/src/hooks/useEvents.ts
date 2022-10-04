import useSWR from 'swr'
import { Event } from '@wasgeit/common/src/types'

export const S3_HOST = 'https://redcoast.fra1.digitaloceanspaces.com'

export const useEvents = () => {
  const {
    data: events,
    error,
    isValidating,
  } = useSWR<Event[]>(
    `${S3_HOST}/wasgeit/events.json`,
    {
      fallbackData: [],
    }
  )
  return { events, error, isValidating }
}
