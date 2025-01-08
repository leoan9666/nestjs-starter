export type TCacheService = {
  set(key: string, value: string, ttl?: number): Promise<void>;
  get(key: string): Promise<string | null>;
  del(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  flush(): Promise<void>;
};

export const UPSTASH = 'upstash';
export const ELASTICACHE = 'elasticache';

export type CacheProvider = typeof UPSTASH | typeof ELASTICACHE;
