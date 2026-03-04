// repetições de erro

import type { Request, Response } from "express";
import { UserService } from "../services/user.service.ts";
import { getErrorMessage } from "@e-commerce/common/src/http-error.ts";

const userService = new UserService();

export const getUsersController = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
};

export const getUserByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.findById(req.params.uuid as string);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: getErrorMessage(error) });
  }
};

export const updateUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.update(req.params.uuid as string, req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: getErrorMessage(error) });
  }
};

export const deleteUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    await userService.delete(req.params.uuid as string);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ message: getErrorMessage(error) });
  }
};