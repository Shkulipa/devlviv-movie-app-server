import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

export interface IUser {
  email: string,
  password: string,
}
export interface IUserRequest extends Request {
	user: JwtPayload;
}

export interface IUserInput extends IUser {}

export interface IUserDecode {
  id: number;
  email: string,
}

export interface IUserRegistered extends IUser {
  id: number
  updatedAt: Date,
  createdAt: Date,
}

