import { IQueryValues } from '../interfaces/pagination.interfaces';
import { IParsedQuery } from '../interfaces/query.interfaces';

export const queryHandler = ({ limit, page }: IQueryValues): IParsedQuery => {
	limit ? (limit = Math.max(1, Math.round(+limit))) : (limit = 10);
	page ? (page = Math.max(1, Math.round(+page))) : (page = 1);

	return { limit, page };
};
