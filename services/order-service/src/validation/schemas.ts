import { z } from 'zod';

export const createOrderSchema = z.object({
  userId: z.uuid(),
  totalAmount: z.number().positive(),
  description: z.string().min(2).max(255),
});

export const updateOrderSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
  totalAmount: z.number().positive().optional(),
  description: z.string().min(2).max(255).optional()
});
