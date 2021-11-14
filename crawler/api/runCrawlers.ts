import { VercelApiHandler } from '@vercel/node'
import { uploadFile } from '../src/upload'
import { runCrawlers } from '../src/crawler'
import crawlers from '../src/crawlers'

const handler: VercelApiHandler = async (req, res) => {
  const events = await runCrawlers(crawlers)
  await uploadFile('events2.json', JSON.stringify(events))
  res.status(200).end()
}

export default handler
