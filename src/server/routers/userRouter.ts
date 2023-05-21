import { Router } from "express";
import { loginUser } from "../controllers/user/userController.js";

export const userRouter = Router();

userRouter.post("/login", loginUser);
