import cors from 'cors';

/**
 * @info
 * don't use * for localhost
 * intead of add
 * origin: ['http://localhost:3000'],
 */
export default cors({
	origin: [
		'http://localhost:3000',
		'https://flourishing-marzipan-8a261a.netlify.app/'
	],
	methods: ['PUT', 'DELETE', 'GET', 'POST', 'PATCH'],
	credentials: true
});
