import { HttpStatus } from '@nestjs/common';

import { ERROR_CONSTANTS } from '@src/error/error.constants';
import { CustomError } from '@src/exception/custom.error';

type ErrorDetails = {
  errors: any;
};

export class ZodCustomError extends CustomError {
  constructor({ errors }: ErrorDetails) {
    super(
      ERROR_CONSTANTS.ZOD.ZOD_VALIDATION_ERROR.code,
      ERROR_CONSTANTS.ZOD.ZOD_VALIDATION_ERROR.message,
      ERROR_CONSTANTS.ZOD.ZOD_VALIDATION_ERROR.httpStatus,
      errors,
    );
  }
}
