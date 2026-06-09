import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiCode } from '../enum/api.code.enum';

export class ApiException extends HttpException {
  private errorMessage: string;
  private errorCode: ApiCode;

  constructor(errorMessage: string) {
    super(errorMessage, HttpStatus.BAD_REQUEST);
    this.errorMessage = errorMessage;
    this.errorCode = ApiCode.FAIL;
  }

  getErrorCode(): ApiCode {
    return this.errorCode;
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }
}
