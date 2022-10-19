export interface IMovieInput {
	title: string;
	year: number;
	runtime: number;
	genre: string;
	director: string;
}

type NotRequire<Type> = {
	[Property in keyof Type]?: Type[Property];
};
export type IMovieInputUpdate = NotRequire<IMovieInput>;
