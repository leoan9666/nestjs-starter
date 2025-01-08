import { Injectable } from '@nestjs/common';

import {
  CacheProvider,
  ELASTICACHE,
  TCacheService,
  UPSTASH,
} from '@src/cache/cache.type';
import { ElastiCacheRedisService } from '@src/cache/providers/elasticache.cache';
import { UpstashCacheService } from '@src/cache/providers/upstash.cache';

@Injectable()
export class CacheService {
  private cacheService: TCacheService;

  constructor(
    private readonly upstashCacheService: UpstashCacheService,
    private readonly elastiCacheRedisService: ElastiCacheRedisService,
  ) {
    this.cacheService = this.upstashCacheService; // Default to upstash
  }

  setProvider(provider: CacheProvider) {
    // Dynamically switch cache provider
    if (provider === UPSTASH) {
      this.cacheService = this.upstashCacheService;
    } else if (provider === ELASTICACHE) {
      this.cacheService = this.elastiCacheRedisService;
    } else {
      throw new Error('Unsupported cache provider');
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    await this.cacheService.set(key, value, ttl);
  }

  async get(key: string): Promise<string | null> {
    return await this.cacheService.get(key);
  }

  async del(key: string): Promise<void> {
    await this.cacheService.del(key);
  }

  async exists(key: string): Promise<boolean> {
    return await this.cacheService.exists(key);
  }

  async flush(): Promise<void> {
    await this.cacheService.flush();
  }
}
