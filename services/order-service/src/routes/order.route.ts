import { Router } from "express";
import { authorized } from "../middlewares/auth.middleware.ts";
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

orderRouter.get("/", authorized("Admin"), getOrdersController);
orderRouter.post("/", validateData(createOrderSchema), createOrderController);
orderRouter.get("/user/:userId", getUserOrdersController);
orderRouter.get("/:uuid", getOrderByIdController);
orderRouter.put("/:uuid/update", validateData(updateOrderSchema), updateOrderController);
orderRouter.delete("/:uuid/delete", authorized("Admin"), deleteOrderController);

export default orderRouter;
