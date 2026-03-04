import { Order } from "../models/order.model.ts";
import type { OrderStatus } from "../validation/types.ts";

export class OrderService {
  async findAll(): Promise<Order[]> {
    return Order.findAll();
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const orders = await Order.findAll({ where: { userId } });
    return orders;
  }

  async findById(uuid: string): Promise<Order> {
    const order = await Order.findByPk(uuid);

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  }

  async create(data: { userId: string; totalAmount: number; description: string }): Promise<Order> {
    return Order.create(data);
  }

  async update(uuid: string, data: Partial<{ 
    status: OrderStatus;
    totalAmount: number;
    description: string 
  }>): Promise<Order> {
    const order = await Order.findByPk(uuid);

    if (!order) {
      throw new Error("Order not found");
    }

    await order.update(data);
    return order;
  }

  async delete(uuid: string): Promise<void> {
    const order = await Order.findByPk(uuid);

    if (!order) {
      throw new Error("Order not found");
    }

    await order.destroy();
  }
}
