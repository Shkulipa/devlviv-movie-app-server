import { DataTypes } from 'sequelize';
import DBService from '../services/db.service';

const sequelize = DBService.db;

const UserModel = sequelize.define('user', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	email: { type: DataTypes.STRING, unique: true },
	password: { type: DataTypes.STRING }
});

export default UserModel;