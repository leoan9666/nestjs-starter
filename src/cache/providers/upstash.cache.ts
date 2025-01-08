import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TCacheService } from '@src/cache/cache.type';
import {
  UPSTASH_CONFIG_NAME,
  UpstashConfig,
} from '@src/config/env/upstash/upstash.config';

import * as Redis from 'ioredis';

@Injectable()
export class UpstashCacheService implements TCacheService {
  private readonly redis: Redis.Redis;

  constructor(private readonly configService: ConfigService) {
    this.redis = new Redis.Redis(
      this.configService.get<UpstashConfig>(UPSTASH_CONFIG_NAME)!.connectionUri,
    );
  }

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
