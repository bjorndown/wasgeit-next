import fs from 'fs'
import path from 'path'
import { Crawler } from '../crawler'

const crawlers: Promise<Crawler>[] = fs
  .readdirSync(__dirname)
  .filter((filename) => !filename.includes('index') && !filename.endsWith('.map'))
  .map((moduleName) =>
    import(path.join(__dirname, moduleName)).then((module) => module.default)
  )

console.dir(crawlers)
console.dir(fs.readdirSync(__dirname))
export default crawlers
