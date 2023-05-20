import express from "express";
import morgan from "morgan";
import { notFoundError } from "./middlewares/notFoundError/notFoundError.js";
import { generalError } from "./middlewares/generalError/generalError.js";

export const app = express();

app.use(express.json());

app.disable("x-powered-by");

app.use(morgan("dev"));

app.use(notFoundError);

app.use(generalError);
