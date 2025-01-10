import { z } from 'zod';

export const DatabaseSchema = z
  .object({
    DATABASE_URL: z.string().min(1, 'Database url is required'),
  })
  .strict();

export type DatabaseSchema = z.infer<typeof DatabaseSchema>;
