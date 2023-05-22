import { type Request } from "express";
import { type Types } from "mongoose";

export interface UserCredentials {
  username: string;
  password: string;
}

export interface UserCredentialsHashed extends UserCredentials {
  name: string;
}

export interface UserData extends UserCredentials {
  _id: string;
}

export interface UserDataBase extends UserCredentials {
  _id: Types.ObjectId;
}

export type UserCredentialsRequest = Request<
  Record<string, any>,
  Record<string, any>,
  UserCredentials
>;
