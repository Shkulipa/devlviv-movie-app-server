import cors from 'cors';

/**
 * @info
 * don't use * for localhost
 */
export default cors({
	origin: ['*'],
	credentials: true
});
