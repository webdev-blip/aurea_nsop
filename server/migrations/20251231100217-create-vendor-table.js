'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vendors', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      category_supplier: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },

      category_customer: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },

      is_service_provider: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },

      code: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },

      repair_station_cert: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      vendor_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },

      address: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      v_city_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'vendor_city',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      zip_code: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },

      state: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      country: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      phone1: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },

      phone2: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },

      phone3: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },

      fax: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },

      contact_person: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },

      email: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },

      nature_of_vendor: {
        type: Sequelize.STRING(150),
        allowNull: true,
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

    await queryInterface.addIndex('vendors', ['v_city_id'], {
      name: 'v_city_id',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('vendors');
  },
};
