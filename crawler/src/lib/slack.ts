import { IncomingWebhook } from '@slack/webhook'
import { getEnvVar } from './env'

const url = getEnvVar('SLACK_WEBHOOK_URL')

const webhook = new IncomingWebhook(url)

export const notifySlack = async (text: string): Promise<void> => {
  await webhook.send(text)
}
