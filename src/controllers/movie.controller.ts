import { NextFunction, Request, Response } from "express";
import { queryHandler } from "../helpers/query.handler";
import { IQueryValues } from "../interfaces/pagination.interfaces";
import logger from "../utils/logger";
import MovieService from "./../services/movie.service";

class MovieController {
	async getMovies(req: Request, res: Response, next: NextFunction) {
		try {
      const { search } = req.body;

			const query: IQueryValues = req.query;
			const { limit, page } = queryHandler({
				limit: query.limit,
				page: query.page
			});
			const movies = await MovieService.getMovies(search, page, limit);
			
      return res.status(200).send(movies);
		} catch (err: any) {
			logger.error(err);
			next(err);
		}
	}

	async getMovieById(req: Request, res: Response, next: NextFunction) {
		try {
      const { id } = req.params;
			const movie = await MovieService.getMovieById(id);
			return res.status(200).send(movie);
		} catch (err: any) {
			logger.error(err);
			next(err);
		}
	}

	async createMovie(req: Request, res: Response, next: NextFunction) {
		try {
      const { body, user } = req;
			const movie = await MovieService.createMovie(body, user);
			return res.status(200).send(movie);
		} catch (err: any) {
			logger.error(err);
			next(err);
		}
	}

  async updateMovie(req: Request, res: Response, next: NextFunction) {
		try {
      const { id } = req.params;
      const { body, user } = req;
			const updatedMovie = await MovieService.updateMovie(id, body, user);
			return res.status(200).send(updatedMovie);
		} catch (err: any) {
			logger.error(err);
			next(err);
		}
	}

  async deleteMovie(req: Request, res: Response, next: NextFunction) {
		try {
      const { id } = req.params;
      const { user } = req;
			const updatedMovie = await MovieService.deleteMovie(id, user);
			return res.status(200).send(updatedMovie);
		} catch (err: any) {
			logger.error(err);
			next(err);
		}
	}

  async getFovoriteMovie(req: Request, res: Response, next: NextFunction) {
		try {
      const { user } = req;
      console.log('get favorites')
			/* const updatedMovie = await MovieService.deleteMovie(id, user);
			return res.status(200).send(updatedMovie); */
		} catch (err: any) {
			logger.error(err);
			next(err);
		}
	}

  async fovoriteMovie(req: Request, res: Response, next: NextFunction) {
		try {
      const { id } = req.params;
      const { user } = req;
			const updatedMovie = await MovieService.favoriteMovie(id, user);
			return res.status(200).send(updatedMovie);
		} catch (err: any) {
			logger.error(err);
			next(err);
		}
	}

}

export default new MovieController();
