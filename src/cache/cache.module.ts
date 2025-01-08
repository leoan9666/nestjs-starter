import { Module } from '@nestjs/common';

import { CacheService } from './cache.service';
import { UpstashCacheService } from '@src/cache/providers/upstash.cache';
import { ElastiCacheRedisService } from '@src/cache/providers/elasticache.cache';

@Module({
  providers: [CacheService, UpstashCacheService, ElastiCacheRedisService],
  exports: [CacheService],
})
export class CacheModule {}
