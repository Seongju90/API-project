'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Spots", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      ownerId: {
        type: Sequelize.INTEGER,
        references: {models: "Users", key: 'id'}
      },
      address: {
        type: Sequelize.VARCHAR(255)
      },
      city: {
        type: Sequelize.VARCHAR(255)
      },
      state: {
        type: Sequelize.VARCHAR(255)
      },
      country: {
        type: Sequelize.VARCHAR(255)
      },
      lat: {
        type: Sequelize.INTEGER
      },
      lng: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.VARCHAR(255)
      },
      description: {
        type: Sequelize.STRING(255)
      },
      price: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Spots');
  }
};
