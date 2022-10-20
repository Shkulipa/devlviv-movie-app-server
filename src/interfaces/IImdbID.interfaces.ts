import { IMovie } from './movie.interfaces';

export interface IImdbID extends Pick<IMovie, 'imdbID' | 'isDeleted'> {}
