import './config/dotenv.config';

import cookieParser from 'cookie-parser';
import express, { Application } from 'express';

import { version } from '../package.json';
import corsConfig from './config/cors.config';
import { errorHandler } from './middlewares/errorHandler.middleware';
import router from './routers';
import DBService from './services/db.service';
import { API_VERSION } from './utils/const';
import logger from './utils/logger';

const host = process.env.HOST;
const port = process.env.PORT;

const server: Application = express();
server.use(corsConfig);
server.use(express.json());
server.use(cookieParser());
server.use(API_VERSION, router);
server.use(errorHandler);

server.listen(port, async (): Promise<void> => {
	logger.info(
		`🚀 Server(v${version}) started on the: http://${host}:${port} (mode: ${process.env.NODE_ENV})`
	);

	await DBService.connectDB();
	await DBService.syncDB();
});
