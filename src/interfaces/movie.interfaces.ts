export interface IMovie {
	id: number;
	title: string;
	year: string;
	runtime: string;
	genre: string;
	director: string;
	imdbID: string;
	isDeleted: boolean;
}

export interface IMovieFromOMB {
	Title: string;
	Year: string;
	imdbID: string;
	Type: string;
	Poster: string;
}

export interface IMovieInput
	extends Pick<IMovie, 'title' | 'year' | 'runtime' | 'genre' | 'director'> {}

export interface IMovieResponse
	extends Pick<IMovie, 'title' | 'year' | 'imdbID'> {}

type NotRequire<Type> = {
	[Property in keyof Type]?: Type[Property];
};
export type IMovieInputUpdate = NotRequire<IMovieInput>;
