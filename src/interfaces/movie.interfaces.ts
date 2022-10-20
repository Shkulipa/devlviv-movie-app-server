export interface IMovieInput {
	title: string;
	year: number;
	runtime: number;
	genre: string;
	director: string;
}

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

type NotRequire<Type> = {
	[Property in keyof Type]?: Type[Property];
};
export type IMovieInputUpdate = NotRequire<IMovieInput>;
