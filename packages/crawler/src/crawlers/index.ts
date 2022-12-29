import './bierhuebeli'
import './dachstock'
import './dynamo'
import './gaskessel'
import './isc'
import './kiff'
import './kofmehl'
import './mokka'
import './muehlehunziken'
import './schueuer'
import './turnhalle'
import './oldcapitol'
import './kufa'
import './roessli'
import './docks'
import './fri-son'
import './cafete'
import './kairo'
import './marta'
import './x-tra'
import './lacapella'
import './heiterefahne'
import { logger } from '../lib/logging'
import { getCrawlers } from '../lib/crawler'

logger.info(
  `Registered ${getCrawlers().length} crawlers: ${getCrawlers()
    .map(crawler => crawler.name)
    .join(', ')}`
)
