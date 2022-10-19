import { DataTypes } from 'sequelize';

import DBService from '../services/db.service';

const sequelize = DBService.db;

const MovieModel = sequelize.define(
	'movie',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		title: { type: DataTypes.STRING, allowNull: false },
		year: { type: DataTypes.STRING, allowNull: false },
		runtime: { type: DataTypes.STRING, allowNull: false },
		genre: { type: DataTypes.STRING, allowNull: false },
		director: { type: DataTypes.STRING, allowNull: false }
	},
	{ timestamps: false }
);

export default MovieModel;
