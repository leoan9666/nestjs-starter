import { z } from 'zod';

export const UpstashSchema = z
  .object({
    UPSTASH_CONNECTION_URI: z.string().min(1, 'Aws access key is required'),
  })
  .strict();

export type UpstashSchema = z.infer<typeof UpstashSchema>;
