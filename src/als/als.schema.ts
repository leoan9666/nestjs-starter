import { z } from 'zod';

export const AlsSchema = z
  .object({
    userID: z.string().min(1, { message: 'User ID is required' }),
    correlationID: z.string().min(1, { message: 'CorrelationID is required' }),
  })
  .strict();

export type AlsSchema = z.infer<typeof AlsSchema>;
