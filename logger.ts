import * as winston from "winston"
import {config} from './config'

const tsFormat = () => (new Date()).toLocaleTimeString()

export const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      filename: `${config.log}`,
      timestamp: tsFormat,
      level: 'info'
    })
  ]
})
