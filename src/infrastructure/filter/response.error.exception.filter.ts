import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'

@Catch(HttpException)
export class ResponseErrorExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    const message = exception.message || exception.getResponse()
    const errorCode = (exception as any).errorCode
    const errorMessage = (exception as any).errorMessage

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    const errorResponse = {
      data: {},
      message: errorMessage || message,
      success: false,
      code: errorCode || status,
    }

    response.status(status)
    response.header('Content-Type', 'application/json; charset=utf-8')
    response.send(errorResponse)
  }
}
