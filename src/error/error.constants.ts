import { HttpStatus } from '@nestjs/common';

export type ErrorCodes = 1001;

export const ERROR_CONSTANTS = {
  ZOD: {
    ZOD_VALIDATION_ERROR: {
      code: 1001 as ErrorCodes,
      message: 'The provided data is invalid.',
      httpStatus: HttpStatus.BAD_REQUEST,
    },
  },
};
