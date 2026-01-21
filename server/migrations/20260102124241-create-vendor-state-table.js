'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vendor_state', {
      state_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      state_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      country_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'vendor_country',
          key: 'country_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    // Prevent duplicate states in same country
    await queryInterface.addConstraint('vendor_state', {
      fields: ['state_name', 'country_id'],
      type: 'unique',
      name: 'unique_state_country',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('vendor_state');
  },
};
