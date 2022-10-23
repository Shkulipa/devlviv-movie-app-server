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
			getImdbIDs =
				Search?.map((film: IMovieOMD) => ({
					imdbID: film.imdbID,
					isDeleted: false
				})) || [];
			const updatedOMDBMovies =
				Search?.map((film: IMovieOMD) => ({
					...film
				})) || [];

			const getIdsArrayStr = getImdbIDs.map(movie => movie.imdbID);
			const getSimilarMovies = (await MovieModel.findAll({
				raw: true,
				where: {
					title: {
						[Op.like]: `%${search}%`
					},
					isDeleted: false,
					imdbID: {
						[Op.not]: [...getIdsArrayStr]
					}
				}
			})) as unknown as IMovie[];

			const dbMovies = (await MovieModel.findAll({
				raw: true,
				where: {
					isDeleted: false,
					[Op.or]: [...getImdbIDs]
				}
			})) as unknown as IMovie[];

			const onlyImdbIDFromDB: string[] = dbMovies.map(film => film.imdbID);

			const replaceMoviesOMBonOwnDB = updatedOMDBMovies.map(
				(film: IMovieOMD) => {
					if (onlyImdbIDFromDB.includes(film.imdbID)) {
						const findMovie = dbMovies.find(
							movieFromDB => movieFromDB.imdbID === film.imdbID
						);
						return findMovie;
					}
					return film;
				}
			);

			const filterMovies = replaceMoviesOMBonOwnDB
				.filter((movie: IMovie) => !movie.isDeleted)
				.map((movie: IMovie) => objKeysToLoweCase(movie));

			const unitedMovies = [...filterMovies, ...getSimilarMovies];
			return unitedMovies;
		} catch (err: any) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

	async getFavoriteMovie(page: number, limit: number, user: IUserDecode) {
		try {
			const offset = page * limit - limit;
			const favoritesMovie = await MovieFavoritesModel.findAndCountAll({
				where: {
					userId: user.id
				},
				limit,
				offset
			});
			return favoritesMovie;
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
					const isMovieFavorite = await MovieFavoritesModel.findOne({
						raw: true, //allow get data without { dataValues: {...}, _previousData: {...}, ... }
						where: { imdbID, userId: user.id }
					});

					if (isMovieFavorite) {
						return {
							...isMovieFavorite,
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
				const bodyCreateMovie = {
					...input,
					imdbID,
					isDeleted: false
				};
				await MovieModel.update(
					{
						...bodyCreateMovie
					},
					{ where: { imdbID } }
				);
				return objKeysToLoweCase(bodyCreateMovie);
			}

			const createdMovie = (
				await MovieModel.create({
					...input,
					imdbID
				})
			).get({ plain: true });

			const createdMovieResponse = objKeysToLoweCase(createdMovie);
			return createdMovieResponse;
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
				await MovieFavoritesModel.destroy({
					where: {
						imdbID
					}
				});
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
			const movie = await this.getMovieById(imdbID);
			const isFavorite = await MovieFavoritesModel.findOne({
				where: {
					userId: +user.id,
					imdbID: imdbID
				}
			});

			if (isFavorite) {
				await MovieFavoritesModel.destroy({
					where: {
						[Op.and]: [{ userId: +user.id }, { imdbID: imdbID }]
					}
				});
				return;
			} else {
				const dataMovie = {
					title: '',
					year: ''
				};

				if (movie) {
					dataMovie.title = movie.title;
					dataMovie.year = movie.year;
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
