import { z } from 'zod';

export const AwsSchema = z
  .object({
    AWS_ACCESS_KEY: z.string().min(1, 'Aws access key is required'),
    AWS_SECRET_KEY: z.string().min(1, 'Aws secret key is required'),
    AWS_REGION: z.enum(['ap-southeast-1']),
  })
  .strict();

export type AwsSchema = z.infer<typeof AwsSchema>;
