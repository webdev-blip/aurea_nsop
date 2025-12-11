'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Periods extends Model {}

  Periods.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique:true
      },
    },
    {
      sequelize,
      modelName: 'Periods',
      tableName: 'periods',
      timestamps: true,
      underscored: true,
    }
  );

  return Periods;
};
