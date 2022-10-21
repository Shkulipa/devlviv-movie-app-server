import cors from 'cors';

/**
 * @info
 * don't use * for localhost
 */
export default cors({
	origin: ['http://localhost:3000'],
	credentials: true
});
