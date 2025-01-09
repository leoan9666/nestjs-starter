import { registerAs } from '@nestjs/config';

import { CacheProvider } from '@src/cache/cache.type';

export const CACHE_CONFIG_NAME = 'cache';
export type CacheConfig = {
  provider: CacheProvider;
};

export default registerAs(
  CACHE_CONFIG_NAME,
  () =>
    ({
      provider: process.env.CACHE_PROVIDER,
    }) as CacheConfig,
);
