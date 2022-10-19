import { object } from "zod";
import SchemaMovieService from "../schemaServices/schemaMovie.service";

const movieAdd = object({
	body: object({
		title: SchemaMovieService.movieTitle(),
		year: SchemaMovieService.movieYear(),
		runtime: SchemaMovieService.movieRuntime(),
		genre: SchemaMovieService.movieGenre(),
		director: SchemaMovieService.movieDirector(),
	})
});

export default movieAdd;