import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  CacheProvider,
  ELASTICACHE,
  TCacheService,
  UPSTASH,
} from '@src/cache/cache.type';
import { ElastiCacheRedisService } from '@src/cache/providers/elasticache.cache';
import { UpstashCacheService } from '@src/cache/providers/upstash.cache';
import {
  CACHE_CONFIG_NAME,
  CacheConfig,
} from '@src/config/env/cache/cache.config';

@Injectable()
export class CacheService {
  constructor(
    private readonly configService: ConfigService,
    private readonly upstashCacheService: UpstashCacheService,
    private readonly elastiCacheRedisService: ElastiCacheRedisService,
  ) {}

  createCacheService(provider?: CacheProvider): TCacheService {
    provider = provider
      ? provider
      : this.configService.get<CacheConfig>(CACHE_CONFIG_NAME)!.provider;

    switch (provider) {
      case UPSTASH:
        return this.upstashCacheService;
      case ELASTICACHE:
        return this.elastiCacheRedisService;
      default:
        throw new Error(`Unsupported cache provider: ${provider}`);
    }
  }
}
