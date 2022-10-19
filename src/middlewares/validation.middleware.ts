import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

const validation =
	(schema: AnyZodObject) =>
	(req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse({
				body: req.body,
				query: req.query,
				params: req.params
			});
			next();
		} catch (err) {
			next(err);
		}
	};

export default validation;
