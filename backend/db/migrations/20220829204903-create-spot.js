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
        references: { model: "Users" },
        onDelete: 'CASCADE'
      },
      address: {
        type: Sequelize.STRING(255)
      },
      city: {
        type: Sequelize.STRING(255)
      },
      state: {
        type: Sequelize.STRING(255)
      },
      country: {
        type: Sequelize.STRING(255)
      },
      lat: {
        type: Sequelize.DECIMAL
      },
      lng: {
        type: Sequelize.DECIMAL
      },
      name: {
        type: Sequelize.STRING(255)
      },
      description: {
        type: Sequelize.STRING(255)
      },
      price: {
        // price can include decimals
        type: Sequelize.DECIMAL
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
