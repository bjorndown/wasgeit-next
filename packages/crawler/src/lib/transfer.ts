import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import zlib from 'node:zlib'
import { getEnvVar } from './env'
import {
  EVENTS_JSON_URL,
  OBJECT_KEY,
  REGION,
  S3_ENDPOINT,
  SPACE_NAME,
} from '@wasgeit/common/src/constants'
import { Event } from '@wasgeit/common/src/types'

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

export const uploadFile = async (events: Event[]): Promise<void> => {
  const putObjectCommand = new PutObjectCommand({
    Bucket: SPACE_NAME,
    Key: OBJECT_KEY,
    Body: zlib.gzipSync(JSON.stringify(events)),
    ACL: 'public-read',
    ContentType: 'application/json',
    ContentEncoding: 'gzip',
    CacheControl: `max-age=${60 * 60 * 2}`,
  })
  await s3Client.send(putObjectCommand)
}

export const downloadEvents = async (): Promise<Event[]> => {
  const response = await fetch(EVENTS_JSON_URL)
  if (response.ok) {
    return response.json()
  }
  throw new Error(await response.text())
}
