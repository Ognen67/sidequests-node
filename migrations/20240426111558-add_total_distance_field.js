'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'totalDistance', {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    });
 },

 down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'totalDistance');
 }
};
