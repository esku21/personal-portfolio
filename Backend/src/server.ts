import { app } from './app.js'
import { env } from './lib/env.js'
import { logger } from './lib/logger.js'

app.listen(env.PORT, '0.0.0.0', () => {
  logger.info(`API listening on port ${env.PORT}`)
})