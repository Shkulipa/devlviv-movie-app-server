import "./config/dotenv.config";
import express, { Application } from "express";
import router from "./routers";
import logger from "./utils/logger";
import corsConfig from './config/cors.config';
import { version } from "../package.json";
import { API_VERSION } from "./utils/const";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import DBService from './services/db.service';

const host = process.env.HOST;
const port = process.env.PORT;

const server: Application = express();
server.use(corsConfig);
server.use(express.json());
server.use(API_VERSION, router);
server.use(errorHandler);

server.listen(port, async (): Promise<void> => {
	logger.info(
		`🚀 Server(v${version}) started on the: http://${host}:${port} (mode: ${process.env.NODE_ENV})`
	);

  await DBService.connectDB();
});
