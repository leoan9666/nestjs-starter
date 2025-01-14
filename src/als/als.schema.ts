import { z } from 'zod';

export const AlsSchema = z
  .object({
    accountID: z.string().min(1, { message: 'Account ID is required' }),
    correlationID: z.string().min(1, { message: 'CorrelationID is required' }),
    account: z.any(),
  })
  .strict();

export type AlsSchema = z.infer<typeof AlsSchema>;
