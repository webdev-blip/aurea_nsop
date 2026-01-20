'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vendor_city', {
      v_city_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      v_city_name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      state_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'vendor_state',
          key: 'state_id',
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

    // Prevent duplicate city in same state
    await queryInterface.addConstraint('vendor_city', {
      fields: ['v_city_name', 'state_id'],
      type: 'unique',
      name: 'unique_city_state',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('vendor_city');
  },
};
