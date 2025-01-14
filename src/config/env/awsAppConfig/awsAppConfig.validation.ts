import { z } from 'zod';

export const AwsAppConfigSchema = z
  .object({
    APP_CONFIG_APPLICATION_ID: z
      .string()
      .min(1, 'App config aplication id is required'),
    APP_CONFIG_ENVIRONMENT_ID: z
      .string()
      .min(1, 'App config environment id is required'),
  })
  .strict();

export type AwsAppConfigSchema = z.infer<typeof AwsAppConfigSchema>;
