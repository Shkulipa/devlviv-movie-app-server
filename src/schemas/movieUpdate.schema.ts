import { object } from "zod";
import SchemaMovieService from "../schemaServices/schemaMovie.service";

const movieUpdate = object({
	body: object({
		title: SchemaMovieService.movieTitle({ optional: true }),
		year: SchemaMovieService.movieYear({ optional: true }),
		runtime: SchemaMovieService.movieRuntime({ optional: true }),
		genre: SchemaMovieService.movieGenre({ optional: true }),
		director: SchemaMovieService.movieDirector({ optional: true }),
	})
});

export default movieUpdate;