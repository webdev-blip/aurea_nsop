'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Aircraft extends Model { }

  Aircraft.init({
    registration_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: DataTypes.STRING,
    owner: DataTypes.STRING,
    hour_type: DataTypes.STRING,
    operator: DataTypes.STRING,
    manufacturer: DataTypes.STRING,
    model: DataTypes.STRING,
    serial_no: DataTypes.STRING,
    empty_weight: DataTypes.FLOAT,
    empty_weight_unit: DataTypes.STRING,
    all_up_weight: DataTypes.FLOAT,
    all_up_weight_unit: DataTypes.STRING,
    gross_payload: DataTypes.FLOAT,
    gross_payload_unit: DataTypes.STRING,
    taxi_weight: DataTypes.FLOAT,
    taxi_weight_unit: DataTypes.STRING,
    takeoff_weight: DataTypes.FLOAT,
    takeoff_weight_unit: DataTypes.STRING,
    zero_fuel_weight: DataTypes.FLOAT,
    zero_fuel_weight_unit: DataTypes.STRING,
    landing_weight: DataTypes.FLOAT,
    landing_weight_unit: DataTypes.STRING,
    fuel_capacity: DataTypes.FLOAT,
    fuel_capacity_unit: DataTypes.STRING,
    maintenance_provider: DataTypes.TEXT,
    fuel_capacity_unit: DataTypes.STRING,
    tsn_data: DataTypes.JSON,
    manufacturing_date: DataTypes.DATE,
    landings: DataTypes.STRING,
    is_under_warranty: DataTypes.BOOLEAN,
    warranty_start_date: DataTypes.DATE,
    warranty_end_date: DataTypes.DATE,
    not_in_use: DataTypes.BOOLEAN,
    not_in_use_date: DataTypes.DATE,
    readonly: DataTypes.BOOLEAN,
    readonly_date: DataTypes.DATE,
    is_flight_log_utc: DataTypes.BOOLEAN,
    dent_buckle_chart: DataTypes.STRING,
    tech_log_option: DataTypes.ENUM('single_sector', 'multiple_sector', 'airborne_time_only')
  }, {
    sequelize,
    modelName: 'Aircraft',
    tableName: 'Aircrafts'
  });

  return Aircraft;
};
