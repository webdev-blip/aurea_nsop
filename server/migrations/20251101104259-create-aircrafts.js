'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Aircrafts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      // ✈️ Aircraft Registration Details
      registration_no: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      category: {
        type: Sequelize.STRING
      },
      owner: {
        type: Sequelize.STRING
      },
      hour_type: {
        type: Sequelize.STRING
      },
      operator: {
        type: Sequelize.STRING
      },

      // ⚙️ Total Weight and Capacity
      empty_weight: {
        type: Sequelize.FLOAT
      },
      empty_weight_unit: {
        type: Sequelize.STRING
      },
      all_up_weight: {
        type: Sequelize.FLOAT
      },
      all_up_weight_unit: {
        type: Sequelize.STRING
      },
      gross_payload: {
        type: Sequelize.FLOAT
      },
      gross_payload_unit: {
        type: Sequelize.STRING
      },
      taxi_weight: {
        type: Sequelize.FLOAT
      },
      taxi_weight_unit: {
        type: Sequelize.STRING
      },
      takeoff_weight: {
        type: Sequelize.FLOAT
      },
      takeoff_weight_unit: {
        type: Sequelize.STRING
      },
      zero_fuel_weight: {
        type: Sequelize.FLOAT
      },
      zero_fuel_weight_unit: {
        type: Sequelize.STRING
      },
      landing_weight: {
        type: Sequelize.FLOAT
      },
      landing_weight_unit: {
        type: Sequelize.STRING
      },
      fuel_capacity: {
        type: Sequelize.FLOAT
      },
      fuel_capacity_unit: {
        type: Sequelize.STRING
      },

      // 🛠 Airframe Details
      manufacturer: {
        type: Sequelize.STRING
      },
      model: {
        type: Sequelize.STRING
      },
      serial_no: {
        type: Sequelize.STRING
      },
      maintenance_provider: {
        type: Sequelize.TEXT
      },

      // 🕓 TSN (Times Since New)
      tsn_data: {
      type: Sequelize.JSON,
        allowNull: true, // optional
        defaultValue: [], // optional, if you want an empty array by default
      },
      manufacturing_date: {
        type: Sequelize.DATE
      },
      landings: {
        type: Sequelize.DATE
      },
      // 🧾 Warranty Details
      is_under_warranty: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      warranty_start_date: {
        type: Sequelize.DATE
      },
      warranty_end_date: {
        type: Sequelize.DATE
      },

      // 🔒 Other Details
      not_in_use_date: {
        type: Sequelize.DATE
      },
      readonly: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      readonly_date: {
        type: Sequelize.DATE
      },
      is_flight_log_utc: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      dent_buckle_chart: {
        type: Sequelize.STRING // File path or attachment name
      },

      // 📘 Tech Log Page
      tech_log_option: {
        type: Sequelize.ENUM('single_sector', 'multiple_sector', 'airborne_time_only')
      },

      // 🕒 Timestamps
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Aircrafts');
  }
};
