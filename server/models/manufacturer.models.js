'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ManufacturerModel extends Model {}

  ManufacturerModel.init(
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
      modelName: 'ManufacturerModel',
      tableName: 'manufacturermodel',
      timestamps: true,
      underscored: true,
    }
  );

  return ManufacturerModel;
};
