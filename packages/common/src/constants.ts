export const SPACE_NAME = 'redcoast'
export const BUCKET_NAME = 'wasgeit'
export const FILENAME = 'events.json'
export const REGION = 'fra1'
export const OBJECT_KEY = `${BUCKET_NAME}/${FILENAME}`
export const EVENTS_JSON_URL = `https://${SPACE_NAME}.${REGION}.digitaloceanspaces.com/${OBJECT_KEY}`

export const S3_ENDPOINT = `https://${REGION}.digitaloceanspaces.com`
