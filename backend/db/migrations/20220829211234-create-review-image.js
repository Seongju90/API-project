'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ReviewImages", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      reviewId: {
        type: Sequelize.INTEGER,
        references: { model: 'Reviews' },
        onDelete: 'CASCADE'
      },
      url: {
        type: Sequelize.STRING(255),
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
    await queryInterface.dropTable('ReviewImages');
  }
};
