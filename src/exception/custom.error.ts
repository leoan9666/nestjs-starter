import { HttpException, HttpStatus } from '@nestjs/common';

import { ErrorCodes } from '@src/error/error.constants';

export class CustomError extends HttpException {
  constructor(
    public errorCode: ErrorCodes,
    public message: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    public data?: any,
  ) {
    super({ errorCode, message, data }, status);
  }
}
