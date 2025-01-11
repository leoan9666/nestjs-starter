import { z } from 'zod';

export const RegisterAccountSchema = z
  .object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Min password length of 8 is required' }),
    phoneNumber: z.coerce
      .string()
      .min(8, { message: 'Min password length of 8 is required' })
      .optional(),
    // roles: z
    //   .array(z.string())
    //   .min(1, { message: 'At least one role is required' }),
  })
  .strict();

export type RegisterAccount = z.infer<typeof RegisterAccountSchema>;
