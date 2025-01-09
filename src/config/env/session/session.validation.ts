import { z } from 'zod';

export const SessionSchema = z
  .object({
    SESSION_SECRET: z.string().min(1, 'Session secret is required'),
    SESSION_RESAVE: z.enum(['true', 'false']),
    SESSION_SAVE_UNINITIALIZED: z.enum(['true', 'false']),
    SESSION_COOKIE_HTTP_ONLY: z.enum(['true', 'false']),
    SESSION_COOKIE_SECURE: z.enum(['true', 'false']),
    SESSION_COOKIE_MAX_AGE: z.coerce
      .number()
      .positive('Cookie max age needs to be a positive number'),
  })
  .strict();

export type SessionSchema = z.infer<typeof SessionSchema>;
