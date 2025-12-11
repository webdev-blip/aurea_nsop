'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('aircraftmodel', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      manufacturers_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      model_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      for_assembly: {
        type: Sequelize.ENUM('Airframe', 'Engine', 'Component', 'Other'),
        allowNull: false,
        defaultValue: 'Airframe',
      },

      primary_model_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('models');
  }
};
