import Minio from 'minio'

const getEnvVar = (name: string): string => {
  const enVar = process.env[name]
  if (!enVar) {
    throw new Error(`env var ${name} not present`)
  }
  return enVar
}

const BUCKET_NAME = 'wasgeit'
const ACCESS_KEY = getEnvVar('S3_ACCESS_KEY')
const SECRET_KEY = getEnvVar('S3_SECRET_KEY')

const client = new Minio.Client({
  endPoint: 'eu-central-1.linodeobjects.com',
  port: 443,
  useSSL: true,
  accessKey: ACCESS_KEY,
  secretKey: SECRET_KEY,
})

export const uploadFile = async (
  fileName: string,
  data: Buffer | string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    client.putObject(BUCKET_NAME, fileName, data, (e) => {
      if (e) {
        reject(e)
      }
      resolve()
    })
  })
}
