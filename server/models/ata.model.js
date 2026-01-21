"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ATA extends Model {
    static associate(models) {
      ATA.hasMany(models.SubATA, {
        foreignKey: "ata_id",
        as: "subatas",
      });
    }
  }

  ATA.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      chapter: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ATA",
      tableName: "ata",
      timestamps: true,
      underscored: true,
    }
  );

  return ATA;
};
