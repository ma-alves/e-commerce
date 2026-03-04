import { z } from "zod";
import type { createOrderSchema, updateOrderSchema } from "./schemas.ts";

export enum OrderStatus {
  Pending = "PENDING",
  Processing = "PROCESSING",
  Shipped = "SHIPPED",
  Delivered = "DELIVERED",
  Cancelled = "CANCELLED"
}

export interface OrderInterface {
  uuid: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
