import { object } from 'zod';

import SchemaMovieService from '../schemaServices/schemaMovie.service';

const search = object({
	body: object({
		search: SchemaMovieService.search()
	})
});

export default search;
