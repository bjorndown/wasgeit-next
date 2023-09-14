import {
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import zlib from 'node:zlib'
import { getEnvVar } from './env'
import {
  BUCKET_NAME,
  EVENTS_JSON_URL,
  OBJECT_KEY,
  REGION,
  S3_ENDPOINT,
  SPACE_NAME,
} from '@wasgeit/common/src/constants'
import { Event } from '@wasgeit/common/src/types'
import { readFileSync } from 'fs'
import { LOG_FILE_PATH, logger } from './logging'
import { CrawlingSummary, StrippedSummary } from './crawler'
import path from 'node:path'
import { formatISO } from 'date-fns'

const ACCESS_KEY = getEnvVar('S3_ACCESS_KEY')
const SECRET_KEY = getEnvVar('S3_SECRET_KEY')

const s3Client = new S3Client({
  endpoint: S3_ENDPOINT,
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
})

const postfix = (counter: number) => (counter > 0 ? `-${counter}` : '')

export const getRunKey = async (): Promise<string> => {
  const today = formatISO(new Date(), { representation: 'date' })
  let counter = 0
  let runKey = `${today}${postfix(counter)}`
  while (await folderExists(path.join(BUCKET_NAME, runKey))) {
    counter++
    if (counter > 10) {
      throw new Error(`too many runs today: ${counter}`)
    }
    runKey = `${today}${postfix(counter)}`
  }
  return runKey
}

const folderExists = async (folderPath: string): Promise<boolean> => {
  const command = new ListObjectsV2Command({
    Bucket: SPACE_NAME,
    Prefix: folderPath,
  })
  const response = await s3Client.send(command)
  return (response.KeyCount ?? 0) > 0
}

export const uploadEvents = async (
  runKey: string,
  events: Event[]
): Promise<void> => {
  const body = zlib.gzipSync(JSON.stringify(events))

  const eventArchive = new PutObjectCommand({
    Bucket: SPACE_NAME,
    Key: path.join(BUCKET_NAME, runKey, 'events.json'),
    Body: body,
    ACL: 'public-read',
    ContentType: 'application/json',
    ContentEncoding: 'gzip',
    Metadata: { runKey },
  })
  await s3Client.send(eventArchive)

  const eventsForFrontend = new PutObjectCommand({
    Bucket: SPACE_NAME,
    Key: OBJECT_KEY,
    Body: body,
    ACL: 'public-read',
    ContentType: 'application/json',
    ContentEncoding: 'gzip',
    CacheControl: `max-age=${60 * 60 * 2}`,
    Metadata: { runKey },
  })
  await s3Client.send(eventsForFrontend)

  logger.info('events uploaded')
}

export const uploadSummary = async (
  runKey: string,
  summary: CrawlingSummary
): Promise<void> => {
  const strippedSummary: StrippedSummary = {
    ...summary,
    successful: summary.successful.map(result => ({
      key: result.key,
      broken: result.broken,
      ignored: result.ignored,
    })),
  }

  const putObjectCommand = new PutObjectCommand({
    Bucket: SPACE_NAME,
    Key: path.join(BUCKET_NAME, runKey, 'summary.json'),
    Body: zlib.gzipSync(JSON.stringify(strippedSummary)),
    ACL: 'public-read',
    ContentType: 'application/json',
    ContentEncoding: 'gzip',
    Metadata: { runKey },
  })
  await s3Client.send(putObjectCommand)
  logger.info('summary uploaded')
}

export const uploadLogJson = async (runKey: string): Promise<void> => {
  const putObjectCommand = new PutObjectCommand({
    Bucket: SPACE_NAME,
    Key: path.join(BUCKET_NAME, runKey, 'log.jsonl'),
    Body: zlib.gzipSync(readFileSync(LOG_FILE_PATH)),
    ACL: 'public-read',
    ContentType: 'application/jsonl',
    ContentEncoding: 'gzip',
    Metadata: { runKey },
  })
  await s3Client.send(putObjectCommand)
  logger.info('log uploaded')
}

export const downloadEvents = async (): Promise<Event[]> => {
  const response = await fetch(EVENTS_JSON_URL)
  if (response.ok) {
    return response.json()
  }
  throw new Error(await response.text())
}
