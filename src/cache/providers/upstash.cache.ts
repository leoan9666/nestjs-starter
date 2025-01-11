import { Inject, Injectable } from '@nestjs/common';

import { TCacheService } from '@src/cache/cache.type';
import { REDIS_CLIENT } from '@src/cache/providers/redis.provider';

import * as Redis from 'ioredis';

@Injectable()
export class UpstashCacheService implements TCacheService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis.Redis) {}

  async set(key: string, value: string, ttl: number = 3600): Promise<void> {
    await this.redis.setex(key, ttl, value);
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }

  async flush(): Promise<void> {
    await this.redis.flushdb();
  }
}
