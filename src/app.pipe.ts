import { Injectable, ArgumentMetadata, PipeTransform } from '@nestjs/common';

import { ERROR_CONSTANTS } from '@src/error/error.constants';
import { ZodCustomError } from '@src/exception/zod.error';
import { ZodError } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: any) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    try {
      this.schema.parse(value);
      return value;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ZodCustomError({ errors: error.errors });
      }
      throw error;
    }
  }
}
