import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { ApiCode } from '../enum/api.code.enum'

export interface BaseResponse<T> {
  code: number
  data: T
  success: boolean
  message: string
}

export class ResponseSuccessTransformInterceptor<T> implements NestInterceptor<T, BaseResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<BaseResponse<T>> | Promise<Observable<BaseResponse<T>>> {
    return next.handle().pipe(
      map((res) => {
        return {
          code: ApiCode.SUCCESS,
          data: res || null,
          message: '请求成功',
          success: true,
        }
      }),
    )
  }
}
