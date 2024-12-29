import { z } from 'zod';

export const AppSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
  })
  .strict();

export type CreateApp = z.infer<typeof AppSchema>;
