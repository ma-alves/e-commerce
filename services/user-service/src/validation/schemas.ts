import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name too long'),
  email: z.email('Invalid email format')
    .toLowerCase(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[^a-zA-Z\d]/, 'Password must contain special character'),
});

export const loginUserSchema = z.object({
  email: z.email('Invalid email format')
    .toLowerCase(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters'),
});

export const updateUserSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name too long'),
  email: z.email('Invalid email format')
    .toLowerCase(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[^a-zA-Z\d]/, 'Password must contain special character'),
  role: z.enum(['User', 'Admin']),
});
