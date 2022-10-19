import { DataTypes } from 'sequelize';

import DBService from '../services/db.service';
import MovieModel from './movie.model';
import MovieFavoritesModel from './movieFavorites.model';

const sequelize = DBService.db;

const UserModel = sequelize.define(
	'user',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		email: { type: DataTypes.STRING, unique: true },
		password: { type: DataTypes.STRING, allowNull: false },
		token: { type: DataTypes.STRING }
	},
	{ timestamps: false }
);

/**
 * @info
 * place relations here,
 * because in separeted file it doen't work
 */
UserModel.hasMany(MovieModel);
MovieModel.belongsTo(UserModel, {
	foreignKey: { name: 'userId' },
	onDelete: 'CASCADE'
});

UserModel.hasMany(MovieFavoritesModel);
MovieFavoritesModel.belongsTo(UserModel, {
	foreignKey: { name: 'userId' },
	onDelete: 'CASCADE'
});

MovieModel.hasMany(MovieFavoritesModel);
MovieFavoritesModel.belongsTo(MovieModel, {
	foreignKey: { name: 'movieId' },
	onDelete: 'CASCADE'
});

export default UserModel;
