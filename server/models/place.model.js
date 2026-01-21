"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Place extends Model {}

  Place.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      short_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      icao: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      city_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: "Place",
      tableName: "place",
      timestamps: true,
      underscored: true,
    }
  );

  return Place;
};
