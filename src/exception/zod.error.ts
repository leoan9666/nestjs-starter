import { HttpStatus } from '@nestjs/common';

import { ErrorCodes } from '@src/error/error.constants';
import { CustomError } from '@src/exception/custom.error';

type ErrorDetails = {
  errorCode: ErrorCodes;
  message: string;
  status: HttpStatus;
  errors: any;
};

export class ZodCustomError extends CustomError {
  constructor({ errorCode, message, status, errors }: ErrorDetails) {
    super(errorCode, message, status, errors);
  }
}
