import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import zlib from 'node:zlib'
import { getEnvVar } from './env'

const SPACE_NAME = 'redcoast'
const BUCKET_NAME = 'wasgeit'
const ACCESS_KEY = getEnvVar('S3_ACCESS_KEY')
const SECRET_KEY = getEnvVar('S3_SECRET_KEY')

const s3Client = new S3Client({
  endpoint: 'https://fra1.digitaloceanspaces.com',
  region: 'fra1',
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
})

export const uploadFile = async (
  fileName: string,
  data: Buffer | string
): Promise<void> => {
  const putObjectCommand = new PutObjectCommand({
    Bucket: SPACE_NAME,
    Key: `${BUCKET_NAME}/${fileName}`,
    Body: zlib.gzipSync(data),
    ACL: 'public-read',
    ContentType: 'application/json',
    ContentEncoding: 'gzip',
    CacheControl: `max-age=${60 * 60 * 2}`,
  })
  await s3Client.send(putObjectCommand)
}
