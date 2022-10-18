import MovieModel from './../models/user.model';
import logger from "../utils/logger";
import { IUserInput } from "../interfaces/user.interfaces";

class MovieService {
	async getMovies() {
    try {
      const movies = await MovieModel.findAll();
      return movies;
		} catch (err: any) {
			logger.error(err);
			throw new Error(err.message);
		}
	}
}

export default new MovieService();
