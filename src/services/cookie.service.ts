import { Response } from "express";
import { CONST } from "../interfaces/consts.interfaces";

class CookieService {
	setRefreshToken(res: Response, refreshToken: string): void {    
		res.cookie(CONST.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      path: "/api",
			maxAge: Number(process.env.EXPIRES_REFRESH)
		});
	}

	deleteRefreshToken(res: Response): void {
		res.clearCookie(CONST.REFRESH_TOKEN);
	}
}

export default new CookieService();
