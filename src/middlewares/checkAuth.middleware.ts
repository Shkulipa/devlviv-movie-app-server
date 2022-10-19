import { Request, Response, NextFunction } from "express";
import Jwt from "./../services/jwt.service";
import logger from "../utils/logger";
import { ApiError } from "../utils/error";

const checkAuth = () => (req: Request, _res: Response, next: NextFunction) => {
	try {
		if (!req.headers.authorization)
      throw ApiError.unauthorized("Please, login");

		const token = req.headers.authorization.split(" ")[1];

		if (!process.env.SECRET_ACCESS_TOKEN)
			throw new Error("Please create <SECRET_ACCESS_TOKEN> in .env file");
    
		const { decoded, expired } = Jwt.verifyJwtToken(
			token,
			process.env.SECRET_ACCESS_TOKEN
		);

		if (expired) throw ApiError.unauthorized("Sorry, yout token was expired");

		req.user = decoded;

		next();
	} catch (err) {
		logger.error(err);
    next(err);
	}
};

export default checkAuth;
