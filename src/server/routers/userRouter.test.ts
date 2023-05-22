import "../../loadEnvironment";
import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../index.js";
import {
  type UserDataBase,
  type UserCredentials,
  type UserCredentialsHashed,
} from "../../types.js";
import connectToDataBase from "../../database/connectToDataBase.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import User from "../../database/models/User.js";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectToDataBase(server.getUri());
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

const mockUser: UserCredentials = {
  username: "Pinxi",
  password: "pinxeta123",
};

const mockUserHashed: UserCredentialsHashed = {
  name: "Bernat",
  username: "Pinxi",
  password: "$2y$10$b3yaTVGuoxDw3HpG4S5X3e.eGFLG0dxN3VWFEvW8t2Ir0h7xsVOzy",
};

describe("Given a POST 'user/login' endpoint", () => {
  describe("When it receives a request with a username 'Pinxi' and a password 'pinxeta123'", () => {
    let newUser: UserDataBase;

    beforeAll(async () => {
      newUser = await User.create(mockUserHashed);
    });

    test("Then it should responde with a response with status 200 and a 'token'", async () => {
      const expectedStatus = 200;

      const response: { body: { token: string } } = await request(app)
        .post("/user/login")
        .send(mockUser)
        .expect(expectedStatus);

      const payload = jwt.verify(response.body.token, process.env.JWT_SECRET!);
      const userId = payload.sub as string;

      expect(userId).toBe(newUser._id.toString());
    });
  });
});
