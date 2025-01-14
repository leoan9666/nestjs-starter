import { Injectable, NestMiddleware } from '@nestjs/common';

import { AlsContext } from '@src/als/als.type';

import { Request, Response, NextFunction } from 'express';
import { v7 as uuidv7 } from 'uuid';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class CorrelationIDMiddleware implements NestMiddleware {
  constructor(private readonly als: AsyncLocalStorage<AlsContext>) {}

  use(req: Request, res: Response, next: NextFunction) {
    const store = {
      accountID: `${req.session['account']['accountID']}` as string,
      correlationID: uuidv7(),
      account: req.session['account'],
    };

    this.als.run(store, () => next());
  }
}
