import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";
import MovieService from "./../services/movie.service";

class MovieController {
	async getMovies(req: Request, res: Response, next: NextFunction) {
		try {
			const movies = await MovieService.getMovies();
			return res.status(200).send(movies);
		} catch (err: any) {
			logger.error(err);
			next(err);
		}
	}
}

export default new MovieController();
