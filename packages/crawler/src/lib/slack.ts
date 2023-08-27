import { IncomingWebhook } from '@slack/webhook'
import { getEnvVar } from './env'
import Transport from 'winston-transport'
import { logger } from './logging'

const url = getEnvVar('SLACK_WEBHOOK_URL')
const webhook = new IncomingWebhook(url)

export const enableSlackTransport = () => {
  logger.add(new SlackTransport({ level: 'info' }))
}

class SlackTransport extends Transport {
  log(info: any, next: () => void): any {
    return webhook
      .send(info.message ?? info)
      .then(() => next())
  }
}
