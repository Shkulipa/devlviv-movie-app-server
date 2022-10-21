import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../utils/error';
import logger from '../utils/logger';
import Jwt from './../services/jwt.service';

const indentificateUser =
	() => (req: Request, _res: Response, next: NextFunction) => {
		try {
			const token =
				req.headers.authorization && req.headers.authorization.split(' ')[1];

			if (!process.env.SECRET_ACCESS_TOKEN)
				throw new Error('Please create <SECRET_ACCESS_TOKEN> in .env file');

			if (token) {
				const { decoded, expired } = Jwt.verifyJwtToken(
					token,
					process.env.SECRET_ACCESS_TOKEN
				);

				if (expired)
					throw ApiError.unauthorized('Sorry, yout token was expired');

				req.user = decoded;
			}

			next();
		} catch (err) {
			logger.error(err);
			next(err);
		}
	};

export default indentificateUser;
