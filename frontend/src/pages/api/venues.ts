import { Event } from '@wasgeit/common/src/types'
import fs from 'fs'
import { NextApiHandler } from 'next'

const { events: allEvents }: { events: Event[] } = JSON.parse(
  fs.readFileSync('./public/events.json').toString()
)

const venues = allEvents.reduce((venues, event) => {
  venues.add(event.venue)
  return venues
}, new Set<string>())

console.log('venues', venues)

const handler: NextApiHandler = async (req, res) => {
  return res.json(Array.from(venues.values()))
}

export default handler