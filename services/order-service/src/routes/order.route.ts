import { Router } from "express";
import { authenticated, authorized } from "../middlewares/auth.middleware.ts";
import { validateData } from "../middlewares/validation.middleware.ts";
import { createOrderSchema, updateOrderSchema } from "../validation/schemas.ts";
import {
  getOrdersController,
  getOrderByIdController,
  getUserOrdersController,
  createOrderController,
  updateOrderController,
  deleteOrderController,
} from "../controllers/order.controller.ts";

const orderRouter = Router();

// Admins can view all orders
orderRouter.get("/", authenticated, authorized("Admin"), getOrdersController);

// Any authenticated user can create an order
orderRouter.post("/", authenticated, validateData(createOrderSchema), createOrderController);

// Any authenticated user can view their own orders
orderRouter.get("/user/:userId", authenticated, getUserOrdersController);

// Any authenticated user can view a specific order (if it's theirs or they're an Admin)
orderRouter.get("/:uuid", authenticated, getOrderByIdController);

// Any authenticated user can update their own orders (or Admins can update any)
orderRouter.put("/:uuid/update", authenticated, validateData(updateOrderSchema), updateOrderController);

// Only Admins can delete orders
orderRouter.delete("/:uuid/delete", authenticated, authorized("Admin"), deleteOrderController);

export default orderRouter;
