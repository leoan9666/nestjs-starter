import { Injectable } from '@nestjs/common';

import { AlsContext } from '@src/als/als.type';
import { AlsSchema } from '@src/als/als.schema';

import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class AppService {
  constructor(private readonly als: AsyncLocalStorage<AlsContext>) {}

  getHello(): string {
    const result = AlsSchema.safeParse(this.als.getStore());

    if (!result.success) {
      console.error('Invalid ALS Context:', result.error.errors);
      // TODO: throw custom zod error
      throw new Error('Zod validation error');
    }

    const userId = result.data.userID;
    const correlationID = result.data.correlationID;
    console.log(`userId: ${userId}`);
    console.log(`correlationID: ${correlationID}`);
    return 'Hello World!';
  }
}
