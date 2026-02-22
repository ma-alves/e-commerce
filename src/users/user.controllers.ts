import type { Request, Response } from "express";
import { UserService } from "./user.service.js";

const userService = new UserService();

export const createUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    res.status(400).json({ message });
  }
};

export const getUsersController = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.findAll();
    res.status(200).json(users);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    res.status(500).json({ message });
  }
};

export const getUserByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.findById(req.params.uuid as string);
    res.status(200).json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    res.status(404).json({ message });
  }
};

export const updateUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.update(req.params.uuid as string, req.body);
    res.status(200).json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    res.status(400).json({ message });
  }
};

export const deleteUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    await userService.delete(req.params.uuid as string);
    res.status(204).send();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    res.status(404).json({ message });
  }
};