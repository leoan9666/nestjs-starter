import { cacheProviders } from '@src/cache/cache.type';

import { z } from 'zod';

export const CacheSchema = z
  .object({
    CACHE_PROVIDER: z.enum(cacheProviders),
  })
  .strict();

export type CacheSchema = z.infer<typeof CacheSchema>;
