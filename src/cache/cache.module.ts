import { Module } from '@nestjs/common';

import { CacheService } from './cache.service';
import { UpstashCacheService } from '@src/cache/providers/upstash.cache';
import { ElastiCacheRedisService } from '@src/cache/providers/elasticache.cache';
import { redisProvider } from '@src/cache/providers/redis.provider';

@Module({
  providers: [
    CacheService,
    UpstashCacheService,
    ElastiCacheRedisService,
    redisProvider,
  ],
  exports: [CacheService, redisProvider],
})
export class CacheModule {}
