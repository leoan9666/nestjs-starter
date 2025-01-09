import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DEFAULT_APP_VERSION } from '@src/app.constant';
import {
  UPSTASH_CONFIG_NAME,
  UpstashConfig,
} from '@src/config/env/upstash/upstash.config';

import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import * as Redis from 'ioredis';

@Injectable()
export class RateLimitingMiddleware implements NestMiddleware {
  private defaultRateLimiter: RateLimiterRedis;
  private customRateLimiters: Record<string, RateLimiterRedis> = {};

  constructor(private readonly configService: ConfigService) {
    const redis = new Redis.Redis(
      this.configService.get<UpstashConfig>(UPSTASH_CONFIG_NAME)!.connectionUri,
    );

    this.defaultRateLimiter = new RateLimiterRedis({
      storeClient: redis,
      points: 10, // number of requests
      duration: 10, // per 1 seconds
      keyPrefix: 'global', // prefix to differentiate global rate limits in Redis
    });

    // Add custom rate limit for specific endpoints
    this.customRateLimiters[`[POST] /v${DEFAULT_APP_VERSION}/`] =
      new RateLimiterRedis({
        storeClient: redis,
        points: 10, // 10 requests
        duration: 20, // per 20 seconds
        keyPrefix: 'custom', // prefix to differentiate custom rate limits in Redis
      });
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Retrieve userID (for example, from a JWT or user authentication)
    const userID = req['user']?.['id'] || req.headers['x-user-id']; // Modify as per your authentication mechanism
    const key = userID ? `${req.ip}:${userID}` : req.ip;

    const path = req.path;

    // Check if there's a custom rate limit for the specific endpoint
    const customRateLimit =
      this.customRateLimiters[
        `[${req.method}] /v${DEFAULT_APP_VERSION}${path}`
      ];

    // Use the custom rate limit if exists, otherwise fallback to global limit
    const limiter = customRateLimit || this.defaultRateLimiter;

    limiter
      .consume(key!) // Use the combined key of IP and userID for rate-limiting
      .then(() => {
        next();
      })
      .catch(() => {
        // When rate limit is exceeded
        res.status(429).send('Too Many Requests');
      });
  }
}
