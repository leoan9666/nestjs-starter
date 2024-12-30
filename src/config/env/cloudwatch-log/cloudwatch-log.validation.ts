import { z } from 'zod';

export const CloudwatchLogSchema = z
  .object({
    LOG_GROUP_NAME: z.string().min(1, 'Log group name is required'),
    LOG_STREAM_NAME: z.string().min(1, 'Log stream name is required'),
    AWS_REGION: z.string().min(1, 'Region is required'),
  })
  .strict();

export type CloudwatchLogSchema = z.infer<typeof CloudwatchLogSchema>;
