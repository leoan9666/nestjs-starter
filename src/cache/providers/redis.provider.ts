import { ConfigService } from '@nestjs/config';

import {
  UPSTASH_CONFIG_NAME,
  UpstashConfig,
} from '@src/config/env/upstash/upstash.config';

import * as Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const redisProvider = {
  provide: REDIS_CLIENT,
  useFactory: async (configService: ConfigService) => {
    return new Redis.Redis(
      configService.get<UpstashConfig>(UPSTASH_CONFIG_NAME)!.connectionUri,
    );
  },
  inject: [ConfigService],
};
