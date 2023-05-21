import { type NextFunction, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  type UserCredentials,
  type UserCredentialsRequest,
} from "../../../types";
import { type UserData } from "../../../types";
import { Types } from "mongoose";
import { loginUser } from "./userController";
import User from "../../../database/models/User";
import CustomError from "../../CustomError/CustomError";

beforeEach(() => {
  jest.clearAllMocks();
});

type CustomResponse = Pick<Response, "status" | "json">;

describe("Given a loginUser middleware", () => {
  const userCredentials: UserCredentials = {
    username: "Bernat",
    password: "pinxeta123",
  };

  const req: Partial<UserCredentialsRequest> = {
    body: userCredentials,
  };

  bcrypt.compare = jest.fn().mockResolvedValue(true);

  const token = "grande token";

  jwt.sign = jest.fn().mockReturnValue(token);

  const next = jest.fn();

  const res: CustomResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  describe("When it receives a request with a valid credentials", () => {
    const expectedStatusCode = 200;

    const user: UserData = {
      _id: new Types.ObjectId().toString(),
      username: "Bernat",
      password: "pinxeta123",
    };

    User.findOne = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(user),
    });

    test("Then it should call a response's status method with a status code 200", async () => {
      await loginUser(
        req as UserCredentialsRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });

    test("Then it should call the response's method json with token", async () => {
      await loginUser(
        req as UserCredentialsRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.json).toHaveBeenLastCalledWith({ token });
    });
  });

  describe("When it receives a request with a wrong username", () => {
    test("Then it should call a next function with a CustomError message 'Wrong credentials'", async () => {
      User.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const customError = new CustomError("Wrong credentials", 404);

      await loginUser(
        req as UserCredentialsRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
  describe("When it receives a request with a wrong password", () => {
    test("Then it should call a next function with a CustomError message 'Wrong credentials'", async () => {
      const user: UserData = {
        _id: new Types.ObjectId().toString(),
        username: "Bernat",
        password: "pinxeta123",
      };

      User.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      });

      bcrypt.compare = jest.fn().mockResolvedValue(false);

      const customError = new CustomError("Wrong credentials", 404);

      await loginUser(
        req as UserCredentialsRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});
