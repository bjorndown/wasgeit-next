import fs from 'fs'
import path from 'path'
import { Crawler } from '../crawler'

const crawlers: Promise<Crawler>[] = fs
  .readdirSync(__dirname)
  .filter((filename) => filename !== 'index.ts')
  .map((moduleName) =>
    import(path.join(__dirname, moduleName)).then((module) => module.default)
  )

export default crawlers
