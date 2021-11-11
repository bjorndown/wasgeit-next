import fs from 'fs'
import path from 'path'
import { Crawler } from '..'

const crawlers: Promise<Crawler>[] = fs
  .readdirSync('./src/crawlers')
  .filter((filename) => filename !== 'index.ts')
  .map((moduleName) =>
    import(path.join(__dirname, moduleName)).then((module) => module.default)
  )

export default crawlers
