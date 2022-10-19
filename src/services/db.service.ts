import { Sequelize } from 'sequelize';

import logger from '../utils/logger';

const DATABASE_DB = process.env.DATABASE_DB!,
	USER_DB = process.env.USER_DB!,
	PASSWORD_DB = process.env.PASSWORD_DB!,
	HOST_DB = process.env.HOST_DB!,
	PORT_DB = process.env.PORT_DB!;

class DBService {
	initDB: Sequelize;
	constructor() {
		this.initDB = new Sequelize(DATABASE_DB, USER_DB, PASSWORD_DB, {
			dialect: 'postgres',
			host: HOST_DB,
			port: Number(PORT_DB)
		});
	}

	async connectDB() {
		try {
			if (DATABASE_DB && USER_DB && PASSWORD_DB && HOST_DB && PORT_DB) {
				const db = this.initDB;
				await db.authenticate();
				logger.info('✅ DB connected');
			} else {
				throw new Error("❌ Url to database isn't correct, check your .env");
			}
		} catch (err) {
			logger.error("❌ Clound't connect to DB", err);
			process.exit(1);
		}
	}

	async syncDB() {
		try {
			await this.initDB.sync();
			logger.info('✅ DB sync finished');
		} catch (err) {
			logger.error('❌ Error sync DB', err);
			process.exit(1);
		}
	}

	get db() {
		return this.initDB;
	}
}

export default new DBService();
