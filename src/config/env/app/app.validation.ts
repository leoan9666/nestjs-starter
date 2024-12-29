import { z } from 'zod';

export const AppSchema = z
  .object({
    ENV: z.enum(['local', 'development', 'staging', 'production']),
    PORT: z.coerce.number().positive('App port must be a positive integer'),
    ORIGIN: z.string().refine(
      (value) => {
        // Check if it's a single string or a string with commas as delimiter
        return value.split(',').every((item) => item.trim().length > 0);
      },
      {
        message:
          'ORIGIN should be a string or a comma-separated list of non-empty strings.',
      },
    ),
  })
  .strict();

export type AppSchema = z.infer<typeof AppSchema>;
