import { NextFunction, Request, Response } from 'express';
import { omit } from 'lodash';

import { CONST } from '../interfaces/consts.interfaces';
import logger from '../utils/logger';
import CookieService from './../services/cookie.service';
import TokenService from './../services/token.service';

class TokenController {
	async refresh(req: Request, res: Response, next: NextFunction) {
		try {
			const cookies = req.cookies;
			const user = await TokenService.refresh(cookies[CONST.REFRESH_TOKEN]);
			CookieService.setRefreshToken(res, user.refreshToken);
			const userResponse = omit(user, ['refreshToken']);
			return res.status(200).send(userResponse);
		} catch (err: any) {
			logger.error(err);
			next(err);
		}
	}
}

export default new TokenController();
