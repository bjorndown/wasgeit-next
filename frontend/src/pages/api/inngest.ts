import { createScheduledFunction } from 'inngest'
import { serve } from 'inngest/next'
import { crawlVenues } from '@wasgeit/crawler/src'
import { getEnvVar } from '@wasgeit/crawler/src/lib/env'

const crawlerCron = createScheduledFunction(
  'wasgeit daily crawl',
  '0 3 * * *',
  crawlVenues
)
export default serve('wasgeit', [crawlerCron], {
  signingKey: getEnvVar('INNGEST_SIGNING_KEY'),
})
