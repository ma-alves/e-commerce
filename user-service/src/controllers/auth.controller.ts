import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.ts";
import { getErrorMessage } from "../utils/http-error.ts";

const authService = new AuthService();

export const registerController = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: getErrorMessage(error) });
  }
};

export const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ message: getErrorMessage(error) });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.user é injetado pelo middleware authenticated
    const result = await authService.refreshToken(req.user!.uuid);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ message: getErrorMessage(error) });
  }
};

export const me = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.user já foi populado pelo middleware authenticated, só retorna
    const { password: _, ...userWithoutPassword } = req.user!.toJSON();
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: getErrorMessage(error) });
  }
};