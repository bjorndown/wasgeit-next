import winston from 'winston'

export const LOG_FILE_PATH = './log.jsonl'

export const logger = winston.createLogger({
  level: process.env.CRAWLER_LOG_LEVEL ?? 'info',
  defaultMeta: { service: 'crawler' },
  transports: [new winston.transports.Console({  format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
      winston.format.errors()
    )})],
})
