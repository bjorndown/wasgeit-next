import { IncomingWebhook } from '@slack/webhook'
import { getEnvVar } from './env'
import Transport from 'winston-transport'

const url = getEnvVar('SLACK_WEBHOOK_URL')
const webhook = new IncomingWebhook(url)

export class SlackTransport extends Transport {
  log(info: any, next: () => void): any {
    return webhook
      .send(info.message ?? info)
      .then(() => next())
  }
}
