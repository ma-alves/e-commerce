import type { Request, Response } from "express";
import { OrderService } from "../services/order.service.ts";
import { getErrorMessage } from "@e-commerce/common/src/http-error.ts";

const orderService = new OrderService();

export const getOrdersController = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await orderService.findAll();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
};

export const getOrderByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await orderService.findById(req.params.uuid as string);
    res.status(200).json(order);
  } catch (error) {
    res.status(404).json({ message: getErrorMessage(error) });
  }
};

export const getUserOrdersController = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await orderService.findByUserId(req.params.userId as string);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
};

export const createOrderController = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await orderService.create({ ...req.body, userId: req.user!.uuid });
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: getErrorMessage(error) });
  }
};

export const updateOrderController = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await orderService.update(req.params.uuid as string, req.body);
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: getErrorMessage(error) });
  }
};

export const deleteOrderController = async (req: Request, res: Response): Promise<void> => {
  try {
    await orderService.delete(req.params.uuid as string);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ message: getErrorMessage(error) });
  }
};
