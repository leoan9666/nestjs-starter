import { Injectable } from '@nestjs/common';

import { TCacheService } from '@src/cache/cache.type';

import * as Redis from 'ioredis';

@Injectable()
export class ElastiCacheRedisService implements TCacheService {
  private redis: Redis.Redis;

  constructor() {
    // this.redis = new Redis.Redis({
    //   host: process.env.ELASTICACHE_REDIS_HOST, // Host for ElastiCache
    //   port: Number(process.env.ELASTICACHE_REDIS_PORT) || 6379, // Default Redis port
    //   password: process.env.ELASTICACHE_REDIS_PASSWORD, // If password is required
    //   tls: process.env.ELASTICACHE_REDIS_TLS === 'true' ? {} : undefined, // Enable TLS if needed
    // });
    this.redis = null as unknown as Redis.Redis;
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
