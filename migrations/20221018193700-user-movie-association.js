'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addConstraint('movies', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'user_movie_association',
      references: {
        table: 'movies',
        field: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeConstraint('movies', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'user_movie_association',
      references: {
        table: 'movies',
        field: 'id'
      }
    })
  }
};
