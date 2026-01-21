"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class VendorState extends Model {
    static associate(models) {
      VendorState.belongsTo(models.VendorCountry, {
        foreignKey: "country_id",
        as: "country",
      });
    }
  }

  VendorState.init(
    {
      state_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      state_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      country_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "VendorState",
      tableName: "vendor_state",
      underscored: true,
      uniqueKeys: {
        unique_state_country: {
          fields: ["state_name", "country_id"],
        },
      },
    }
  );

  return VendorState;
};
