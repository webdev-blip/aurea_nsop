"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Vendor extends Model {
      static associate(models) {
      Vendor.belongsTo(models.VendorCity, {
        foreignKey: "v_city_id",
        as: "city",
      });
    }
  }

  Vendor.init(
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

      category_supplier: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      category_customer: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      is_service_provider: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      code: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },

      repair_station_cert: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      vendor_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },

      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      v_city_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      zip_code: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },

      state: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      country: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      phone1: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },

      phone2: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },

      phone3: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },

      fax: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },

      contact_person: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },

      email: {
        type: DataTypes.STRING(150),
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },

      nature_of_vendor: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Vendor",
      tableName: "vendors",
      timestamps: true,
      underscored: true,
    }
  );

  return Vendor;
};
