export type ISODateTime = string
export type ISODate = string
export type EventsByDate = Record<ISODate, Event[]>

export type Event = {
  title: string
  url: string
  start: ISODateTime
  end?: ISODateTime
  venue: string
}
