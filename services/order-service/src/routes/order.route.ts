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

orderRouter.get("/", authenticated, authorized("Admin"), getOrdersController);
orderRouter.post("/", authenticated, validateData(createOrderSchema), createOrderController);
orderRouter.get("/user/:userId", authenticated, getUserOrdersController);
orderRouter.get("/:uuid", authenticated, getOrderByIdController);
orderRouter.put("/:uuid/update", authenticated, validateData(updateOrderSchema), updateOrderController);
orderRouter.delete("/:uuid/delete", authenticated, authorized("Admin"), deleteOrderController);

export default orderRouter;
