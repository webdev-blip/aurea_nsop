"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class VendorCountry extends Model {}

  VendorCountry.init(
    {
      country_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      country_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "VendorCountry",
      tableName: "vendor_country",
      underscored: true,
    }
  );

  return VendorCountry;
};
