export type ISODateTime = string

export type Event = {
  title: string
  url: string
  start: ISODateTime
  end?: ISODateTime
}