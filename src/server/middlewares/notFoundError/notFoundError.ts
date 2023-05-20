import { type Request, type Response, type NextFunction } from "express";
import createDebug from "debug";
import CustomError from "../../CustomError/CustomError.js";

const debug = createDebug("isdinetwork-api:server:middleware:notFoundError");

export const notFoundError = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  const error = new CustomError("Endpoint not found", 404);

  debug(error.message);
  debug(error.statusCode);

  next(error);
};
