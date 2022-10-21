import { Op } from 'sequelize';

import { IMovieOMD } from '../interfaces/film.interfaces';
import { IImdbID } from '../interfaces/IImdbID.interfaces';
import { IUserDecode } from '../interfaces/user.interfaces';
import MovieFavoritesModel from '../models/movieFavorites.model';
import { $omdApi } from '../utils/axios';
import logger from '../utils/logger';
import { objKeysToLoweCase } from '../utils/objectKeysLowecase';
import { uuidGenerater } from '../utils/uuidGenerater';
import {
	IMovie,
	IMovieFromOMB,
	IMovieInput,
	IMovieInputUpdate
} from './../interfaces/movie.interfaces';
import MovieModel from './../models/movie.model';
import { ApiError } from './../utils/error';

class MovieService {
	async getMovies(search = '') {
		try {
			const { data } = await $omdApi.get('/', {
				params: {
					s: search
				}
			});
			const { Search } = data;

			let getImdbIDs: IImdbID[] = [];
			let onlyImdbIDFromIMD: string[] = [];
			if (Search) {
				getImdbIDs = Search.map((film: IMovieOMD) => ({
					imdbID: film.imdbID,
					isDeleted: false
				}));
				onlyImdbIDFromIMD = Search.map((film: IMovieOMD) => film.imdbID);
			}

			const dbMovies = (await MovieModel.findAll({
				where: {
					[Op.or]: [...getImdbIDs]
				}
			})) as unknown as IMovie[];
			const onlyImdbIDFromDB: string[] = dbMovies.map(film => film.imdbID);

			const dbMoviesOwnDD = await MovieModel.findAll({
				where: {
					title: {
						[Op.like]: `%${search}%`
					},
					isDeleted: false
				}
			});

			const movies: (IMovie | IMovieFromOMB)[] = [];
			onlyImdbIDFromDB.forEach((ImdbID, idx) => {
				if (onlyImdbIDFromIMD.includes(ImdbID)) {
					movies.push(dbMovies[idx]);
				}
			});
			onlyImdbIDFromIMD.forEach((ImdbID, idx) => {
				if (!onlyImdbIDFromDB.includes(ImdbID)) movies.push(Search[idx]);
			});

			const moviesConverKeys = movies.map(movie => objKeysToLoweCase(movie));
			const moviesResponse = [...dbMoviesOwnDD, ...moviesConverKeys];
			return moviesResponse;
		} catch (err: any) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

	async getFavoriteMovie(page: number, limit: number, user: IUserDecode) {
		try {
			const offset = page * limit - limit;
			return await MovieFavoritesModel.findAndCountAll({
				where: {
					userId: user.id
				},
				limit,
				offset
			});
		} catch (err: any) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

	async getMovieById(imdbID: string, user?: IUserDecode) {
		try {
			/**
			 * @info
			 * check is deleted
			 */
			const isDeleted = await MovieModel.findOne({
				where: { imdbID, isDeleted: true }
			});
			if (isDeleted) throw ApiError.badRequest("Movie wasn't found");

			/**
			 * @info
			 * check in the own DB
			 */
			const movie = await MovieModel.findOne({
				where: { imdbID, isDeleted: false }
			});
			if (movie) {
				if (user) {
					const isMovieFavorite = await MovieModel.findOne({
						where: { imdbID, isDeleted: false, userId: user.id }
					});

					if (isMovieFavorite) {
						return {
							...movie,
							isFavorite: true
						};
					}
				}

				return movie;
			}

			/**
			 * @info
			 * check in the OMB
			 */
			const { data } = await $omdApi.get('/', {
				params: {
					i: imdbID
				}
			});

			if (data) {
				const makeLowerCase = objKeysToLoweCase(data);
				return makeLowerCase;
			}

			/**
			 * @info
			 * if it wasn't found
			 */
			if (!movie && !data) throw ApiError.badRequest("Movie wasn't found");
		} catch (err: any) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

	async createMovie(input: IMovieInput) {
		try {
			const imdbID = uuidGenerater();

			const movieIsDeleted = await MovieModel.findOne({
				where: { imdbID, isDeleted: true }
			});
			if (movieIsDeleted) {
				await MovieModel.update(
					{
						...input,
						imdbID,
						isDeleted: false
					},
					{ where: { imdbID } }
				);
				return;
			}

			return await MovieModel.create({
				...input,
				imdbID
			});
		} catch (err: any) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

	async updateMovie(imdbID: string, newValues: IMovieInputUpdate) {
		try {
			const movie = await MovieModel.findOne({
				where: { imdbID, isDeleted: false }
			});
			if (movie) {
				await MovieModel.update(
					{
						...newValues
					},
					{ where: { imdbID } }
				);
				return;
			}

			if (!movie) {
				const { data } = await $omdApi.get('/', {
					params: {
						i: imdbID
					}
				});
				if (!data) throw ApiError.badRequest("Movie wasn't found");

				const { Title, Year, Runtime, Genre, Director } = data as IMovieOMD;
				const unitedValues = {
					title: Title,
					year: Year,
					runtime: Runtime,
					genre: Genre,
					director: Director,
					...newValues
				};

				await MovieModel.create({
					...unitedValues,
					imdbID
				});
			}
		} catch (err: any) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

	async deleteMovie(imdbID: string) {
		try {
			const { data } = await $omdApi.get('/', {
				params: {
					i: imdbID
				}
			});

			const movieIsDeleted = await MovieModel.findOne({
				where: { imdbID, isDeleted: true }
			});
			if (movieIsDeleted) return;

			const isMovie = await MovieModel.findOne({
				where: { imdbID, isDeleted: false }
			});
			if (isMovie) {
				await MovieModel.update(
					{
						isDeleted: true
					},
					{ where: { imdbID } }
				);
				return;
			}

			const { Title, Year, Runtime, Genre, Director } = data as IMovieOMD;
			const newValues = {
				title: Title,
				year: Year,
				runtime: Runtime,
				genre: Genre,
				director: Director
			};

			await MovieModel.create({
				...newValues,
				imdbID,
				isDeleted: true
			});
		} catch (err: any) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

	async favoriteMovie(imdbID: string, user: IUserDecode) {
		try {
			await this.getMovieById(imdbID);

			const isFavorite = await MovieFavoritesModel.findOne({
				where: {
					userId: +user.id,
					imdbID: imdbID
				}
			});

			if (isFavorite)
				await MovieFavoritesModel.destroy({
					where: {
						[Op.and]: [{ userId: +user.id }, { imdbID: imdbID }]
					}
				});
			else {
				const dataMovie = {
					title: '',
					year: ''
				};

				const movie = await MovieModel.findOne({
					where: { imdbID, isDeleted: false }
				});
				if (movie) {
					dataMovie.title = movie.getDataValue('title');
					dataMovie.year = movie.getDataValue('year');
				}

				if (!movie) {
					const { data } = await $omdApi.get('/', {
						params: {
							i: imdbID
						}
					});
					dataMovie.title = data.Title;
					dataMovie.year = data.Year;
				}

				await MovieFavoritesModel.create({
					userId: +user.id,
					imdbID: imdbID,
					...dataMovie
				});
			}
		} catch (err: any) {
			logger.error(err);
			throw new Error(err.message);
		}
	}
}

export default new MovieService();
