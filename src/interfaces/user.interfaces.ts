import { Types } from "mongoose";
import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

export enum IUserKeys {
  _id = "_id",
  name = "name",
  email = "email",
  password = "password"
}

export interface IUser {
	_id: Types.ObjectId;
  name: string,
  email: string,
  password: string,
}

export interface IUserModel extends Document, IUser {}

export interface IUserRequest extends Request {
	user: JwtPayload;
}

export interface IUserDecode extends Omit<IUser, "password">{
	iat: number;
	exp: number;
}

export interface IUserInput {
  name: string,
  email: string,
  password: string
}