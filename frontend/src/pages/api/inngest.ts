import { createScheduledFunction } from 'inngest'
import { serve } from 'inngest/next'
import { crawlVenues } from '@wasgeit/crawler/src'

const crawlerCron = createScheduledFunction(
  'wasgeit daily crawl',
  '0 3 * * *',
  crawlVenues
)
export default serve('wasgeit', [crawlerCron])
