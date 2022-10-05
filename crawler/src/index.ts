import express from 'express'
import { runCrawlers } from './crawler'
import crawlers from './crawlers'
import { uploadFile } from './upload'
import { logger } from './logging'
import { getEnvVar } from './env'

const app = express()
const PORT = process.env.PORT ?? 8080

const API_KEY = getEnvVar('CRAWLER_API_KEY')
const API_KEY_HEADER_NAME = 'x-api-key'

app.get('/api/crawl', async (req, res) => {
  try {
    if (req.headers[API_KEY_HEADER_NAME] !== API_KEY) {
      return res.sendStatus(401)
    }

    const events = await runCrawlers(crawlers)
    logger.info('venues crawled')

    await uploadFile('events.json', JSON.stringify(events))
    logger.info('events uploaded')

    return res.sendStatus(200)
  } catch (error) {
    return res.sendStatus(500)
  }
})

const server = app.listen(PORT, () => {
  console.log(`listening on ${PORT}...`)
})

const shutdown = () => {
  if (server) {
    console.log('shutting down server...')
    server.close((error) => {
      if (error) {
        console.error('error happened while shutting down:', error)
      }
    })
  }
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
