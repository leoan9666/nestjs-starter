import { z } from 'zod';

export const AwsAppConfigSchema = z
  .object({
    'is-admin': z.object({
      enabled: z.boolean(),
      env: z.enum(['dev', 'stg', 'prod']).optional(),
    }),
    'promo-flag': z.any(),
  })
  .strict();

export type AwsAppConfig = z.infer<typeof AwsAppConfigSchema>;
