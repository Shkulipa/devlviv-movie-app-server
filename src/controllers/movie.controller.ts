import { NextFunction, Request, Response } from 'express';

import { queryHandler } from '../helpers/query.handler';
import { IQueryValues } from '../interfaces/pagination.interfaces';
import logger from '../utils/logger';
import MovieService from './../services/movie.service';

class MovieController {
	async getMovies(req: Request, res: Response, next: NextFunction) {
		try {
			const { search } = req.body;
			const movies = await MovieService.getMovies(search);

			return res.status(200).send(movies);
		} catch (err: any) {
			logger.error(err);
			next(err);
		}
	}

	async getMovieById(req: Request, res: Response, next: NextFunction) {
		try {
			const { imdbID } = req.params;
			const movie = await MovieService.getMovieById(imdbID);
			return res.status(200).send(movie);
		} catch (err: any) {
			logger.error(err);
			next(err);
		}
	}

	async createMovie(req: Request, res: Response, next: NextFunction) {
		try {
			const { body } = req;
			const movie = await MovieService.createMovie(body);
			return res.status(200).send(movie);
		} catch (err: any) {
			logger.error(err);
			next(err);
		}
	}

	async updateMovie(req: Request, res: Response, next: NextFunction) {
		try {
			const { imdbID } = req.params;
			const { body } = req;
			const updatedMovie = await MovieService.updateMovie(imdbID, body);
			return res.status(200).send(updatedMovie);
		} catch (err: any) {
			logger.error(err);
			next(err);
		}
	}

	async deleteMovie(req: Request, res: Response, next: NextFunction) {
		try {
			const { imdbID } = req.params;
			const updatedMovie = await MovieService.deleteMovie(imdbID);
			return res.status(200).send(updatedMovie);
		} catch (err: any) {
			logger.error(err);
			next(err);
		}
	}

	async getFovoriteMovie(req: Request, res: Response, next: NextFunction) {
		try {
			const { user } = req;
			const query: IQueryValues = req.query;
			const { limit, page } = queryHandler({
				limit: query.limit,
				page: query.page
			});
			const favoritesMovie = await MovieService.getFavoriteMovie(
				page,
				limit,
				user
			);
			return res.status(200).send(favoritesMovie);
		} catch (err: any) {
			logger.error(err);
			next(err);
		}
	}

	async fovoriteMovie(req: Request, res: Response, next: NextFunction) {
		try {
			const { imdbID } = req.params;
			const { user } = req;
			const updatedMovie = await MovieService.favoriteMovie(imdbID, user);
			return res.status(200).send(updatedMovie);
		} catch (err: any) {
			logger.error(err);
			next(err);
		}
	}
}

export default new MovieController();
