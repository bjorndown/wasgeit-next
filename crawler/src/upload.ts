import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const getEnvVar = (name: string): string => {
  const enVar = process.env[name]
  if (!enVar) {
    throw new Error(`env var ${name} not present`)
  }
  return enVar
}

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
  const params = {
    Bucket: SPACE_NAME,
    Key: `${BUCKET_NAME}/${fileName}`,
    Body: data,
    ACL: 'public-read',
    Metadata: {
      'x-amz-meta-content-type': 'application/json',
    },
  }
  await s3Client.send(new PutObjectCommand(params))
}
