'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable("place", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      short_name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      icao: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },

      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      city_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "city",   
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("place");
  }
};
