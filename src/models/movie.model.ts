import { DataTypes } from 'sequelize';
import DBService from '../services/db.service';

const sequelize = DBService.db;

const MovieModel = sequelize.define('movie', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING },
  year: { type:DataTypes.STRING },
  runtime: { type:DataTypes.STRING },
  genre: { type:DataTypes.STRING },
  director: { type: DataTypes.STRING },
});

export default MovieModel;