import { Schema, model, Types } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    min: 3,
  },
  username: {
    type: String,
    min: 5,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  friends: [{ type: Types.ObjectId, ref: "User" }],
  enemies: [{ type: Types.ObjectId, ref: "User" }],
});

const User = model("User", userSchema, "users");

export default User;
