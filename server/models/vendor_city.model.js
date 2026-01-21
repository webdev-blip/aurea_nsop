"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class VendorCity extends Model {
    static associate(models) {
      VendorCity.belongsTo(models.VendorState, {
        foreignKey: "state_id",
        as: "state",
      });
    }
  }

  VendorCity.init(
    {
      v_city_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      v_city_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      state_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "VendorCity",
      tableName: "vendor_city",
      timestamps: true,
      underscored: true,
      uniqueKeys: {
        unique_city_state: {
          fields: ["v_city_name", "state_id"],
        },
      },
    }
  );

  return VendorCity;
};
