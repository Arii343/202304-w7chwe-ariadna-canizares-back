import { type NextFunction, type Request, type Response } from "express";
import { notFoundError } from "./notFoundError.js";
import CustomError from "../../CustomError/CustomError.js";

describe("Given a notFoundError middleware", () => {
  describe("When it receives a next function", () => {
    const req = {};
    const res = {};
    const next: NextFunction = jest.fn();

    test("Then it should be called", () => {
      notFoundError(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    test("Then it should be called with CustomError", () => {
      const error = new CustomError("Endpoint not found", 404);

      notFoundError(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
