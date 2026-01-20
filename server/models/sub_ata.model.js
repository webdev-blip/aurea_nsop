"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SubATA extends Model {
    static associate(models) {
      SubATA.belongsTo(models.ATA, {
        foreignKey: "ata_id",
        as: "ata",
      });
    }
  }

  SubATA.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
       ata_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ata_chapter: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      sub_ata_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      sub_code: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      sub_ata_chapter: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "SubATA",
      tableName: "sub_ata",
      timestamps: true,
      underscored: true,
    },
  );

  return SubATA;
};
