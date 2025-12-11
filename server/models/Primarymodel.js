'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Primarymodel extends Model {}

  Primarymodel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true, 
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Primarymodel',
      tableName: 'Primarymodel',
      timestamps: true,
      underscored: true,
    }
  );

  return Primarymodel;
};
