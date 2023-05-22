import { type NextFunction, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import CustomError from "../../CustomError/CustomError.js";
import { type UserCredentialsRequest } from "../../../types";
import User from "../../../database/models/User.js";

export const loginUser = async (
  req: UserCredentialsRequest,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).exec();

    if (!user || !(await bcrypt.compare(password, user.password))) {
      const customError = new CustomError("Wrong credentials", 401);

      throw customError;
    }

    const tokenPayload: JwtPayload = {
      sub: user._id.toString(),
      name: user.username,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!);

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};
