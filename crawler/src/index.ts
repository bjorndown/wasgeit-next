import { runCrawlers } from './crawler'
import crawlers from './crawlers'
import { uploadFile } from './upload'

const main = async () => {
  const events = await runCrawlers(crawlers)
  await uploadFile('events.json', JSON.stringify(events))
}

main().catch(console.error)