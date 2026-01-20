'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sub_ata', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
       ata_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ata', 
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      ata_chapter: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      sub_ata_code: {
        type: Sequelize.STRING(50), // codes should be strings
        allowNull: false,
      },

      sub_code: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },

      sub_ata_chapter: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable('sub_ata');
  },
};
