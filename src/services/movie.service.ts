import { IMovieInput, IMovieInputUpdate } from './../interfaces/movie.interfaces';
import { Op } from 'sequelize';
import MovieModel from './../models/movie.model';
import { ApiError } from './../utils/error';
import logger from '../utils/logger';
import { IUserDecode } from '../interfaces/user.interfaces';
import MovieFavoritesModel from '../models/movieFavorites.model';
import DBService from './db.service';

class MovieService {
	async getMovies(search: string = '', page: number, limit: number) {
		try {
			const offset = page * limit - limit;
      const opLike = { [Op.like]: `%${search}%` };
			return await MovieModel.findAndCountAll({
        where: {
          [Op.or]: [
            { title: opLike },
            { genre: opLike },
            { director: opLike },
          ]
        },
				limit,
				offset
			});
		} catch (err: any) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

	async getMovieById(id: string) {
		try {
			const movie = await MovieModel.findOne({ where: { id } });
			if (!movie) throw ApiError.badRequest("Movie wasn't found");
			return movie;
		} catch (err: any) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

	async createMovie(input: IMovieInput, user: IUserDecode) {
		try {
			return await MovieModel.create({
				...input,
				userId: user.id
			});
		} catch (err: any) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

	async updateMovie(id: string, newValues: IMovieInputUpdate, user: IUserDecode ) {
		try {
      await this.isExsistMovie(id);
      await this.isOwnerMovie(id, user.id);

      return await MovieModel.update({
        ...newValues
      }, { where: { id }});
		} catch (err: any) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

	async deleteMovie(id: string, user: IUserDecode) {
		try {
      const movie = await this.isExsistMovie(id);
      const ownerId = movie.getDataValue('userId');

      await this.isOwnerMovie(ownerId, user.id);

			await MovieModel.destroy({ where: { id } });
		} catch (err: any) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

	async favoriteMovie(id: string, user: IUserDecode) {
		try {
      await this.isExsistMovie(id);
      
      const isFavorite = await MovieFavoritesModel.findOne({ where: { 
        userId: +user.id,
        movieId: +id
      }});

      if(isFavorite) await MovieFavoritesModel.destroy({
        where: {
          [Op.and]: [
            { userId: +user.id },
            { movieId: +id  },
          ]
        }
      });
      else await MovieFavoritesModel.create({ 
        userId: +user.id,
        movieId: +id 
      });
		} catch (err: any) {
			logger.error(err);
			throw new Error(err.message);
		}
	}

  async getАavoriteMovie(page: number, limit: number, user: IUserDecode) {
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

  async isExsistMovie(movieId: string) {
   /**
     * @info
     * is exsist movie by id in database ?
     */
    const movie = await MovieModel.findOne({ where: { id: movieId } });
    if (!movie) throw ApiError.badRequest("Movie wasn't found");
    return movie;
  }

  async isOwnerMovie(movieIdOwner: string, userId: number) {
    /**
     * @info
     * is user a owner by this movie ?
     */
    const isOwner = String(movieIdOwner) === String(userId);
    if (!isOwner) throw ApiError.badRequest("You aren't owner this movie");
  }
}

export default new MovieService();
