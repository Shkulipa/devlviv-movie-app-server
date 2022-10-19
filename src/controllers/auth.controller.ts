import { NextFunction, Request, Response } from "express";
import CookieService from "./../services/cookie.service";
import logger from "../utils/logger";
import UserService from "./../services/user.service";

class AuthController {
	async signup(req: Request, res: Response, next: NextFunction) {
		try {
			const input = req.body;
			const user = await UserService.signup(input);
      CookieService.setRefreshToken(res, user.refreshToken);
			return res.status(200).send(user);
		} catch (err: any) {
			logger.error(err);
			next(err);
		}
	}

  async signin(req: Request, res: Response, next: NextFunction) {
		try {
			const input = req.body;
			const user = await UserService.signin(input);
      CookieService.setRefreshToken(res, user.refreshToken);
			return res.status(200).send(user);
		} catch (err: any) {
			logger.error(err);
			next(err);
		}
	}

  async logout(req: Request, res: Response, next: NextFunction) {
		try {
			const { REFRESH_TOKEN } = req.cookies;
			if (!REFRESH_TOKEN) return res.status(200).send("Token isn't exsist");
			await UserService.logout(REFRESH_TOKEN);
			CookieService.deleteRefreshToken(res);
			return res.status(200).send("You success logout");
		} catch (err: any) {
			logger.error(err);
			next(err);
		}
	}
}

export default new AuthController();
