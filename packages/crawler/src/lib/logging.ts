import winston from 'winston'

export const LOG_FILE_PATH = './log.jsonl'

export const logger = winston.createLogger({
  level: process.env.CRAWLER_LOG_LEVEL ?? 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'crawler' },
  transports: [new winston.transports.Console()],
})
