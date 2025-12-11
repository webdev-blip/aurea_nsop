'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AircraftModel extends Model {
    static associate(models) {
      // 🛠 Define associations if needed later
      // AircraftModel.hasMany(models.Aircraft, { foreignKey: 'model_id' });
    }
  }

  AircraftModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      // 🏭 Manufacturer Reference
      manufacturer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      // 🛫 Model Name
      model_name: {
        type: DataTypes.STRING(150),
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },

      // ⚙️ Assembly Type
      assembly: {
        type: DataTypes.ENUM('Airframe', 'Engine', 'Propeller', 'Rotor', 'Other'),
        allowNull: false,
        defaultValue: 'Airframe',
      },

      // 🧩 Primary Model Reference (optional)
      primary_model_id: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },

 
    },
    {
      sequelize,
      modelName: 'AircraftModel',
      tableName: 'aircraftmodel',
      timestamps: true,
      underscored: true,

    }
  );

  return AircraftModel;
};
