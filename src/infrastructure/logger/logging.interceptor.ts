import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable, tap } from 'rxjs'
import * as winston from 'winston'
import 'winston-daily-rotate-file'

const winstonLogger = winston.createLogger({
  transports: [
    new winston.transports.DailyRotateFile({
      filename: 'logs/reqlog_%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:SSS' }),
        winston.format.json({ space: 2 }),
      ),
    }),
  ],
})

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()
    const { method, url, body, query, params, headers } = req
    const start = Date.now()

    return next.handle().pipe(
      tap({
        next: (data) => {
          winstonLogger.info({
            duration: `${Date.now() - start}ms`,
            request: { url, method, body, query, params, headers },
            response: data,
          })
        },
        error: (err) => {
          winstonLogger.error({
            duration: `${Date.now() - start}ms`,
            request: { url, method, body, query, params, headers },
            error: err.message,
          })
        },
      }),
    )
  }
}
