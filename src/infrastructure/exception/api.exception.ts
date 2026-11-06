import { HttpException, HttpStatus } from '@nestjs/common'
import { ApiCode } from '../enum/api.code.enum'

export class ApiException extends HttpException {
  private errorMessage: string
  private apiCode: ApiCode

  constructor(errorMessage: string) {
    super(errorMessage, HttpStatus.BAD_REQUEST)
    this.errorMessage = errorMessage
    this.apiCode = ApiCode.FAIL
  }

  getErrorCode(): ApiCode {
    return this.apiCode
  }

  getErrorMessage(): string {
    return this.errorMessage
  }
}
