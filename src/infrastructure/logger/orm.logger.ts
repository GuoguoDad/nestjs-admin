import { FileLogger } from 'typeorm'
import { LoggerOptions } from 'typeorm/logger/LoggerOptions'

import * as winston from 'winston'
import 'winston-daily-rotate-file'

const winstonLogger = winston.createLogger({
  transports: [
    new winston.transports.DailyRotateFile({
      filename: 'logs/ormlog_%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      // format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:SSS' }), winston.format.json({ space: 2 })),
    }),
  ],
})

export class OrmLogger extends FileLogger {
  constructor(options: LoggerOptions) {
    super(options, { logPath: './logs' })
  }

  protected writeLog(level: 'log' | 'info' | 'warn', message: object): void {
    winstonLogger.info(message)
  }
}
