'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      movie.belongsTo(models.user);
      models.user.hasMany(movie);
    }
  }
  movie.init({
    title: DataTypes.STRING,
    year: DataTypes.STRING,
    runtime: DataTypes.STRING,
    genre: DataTypes.STRING,
    director: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'movie',
  });
  return movie;
};