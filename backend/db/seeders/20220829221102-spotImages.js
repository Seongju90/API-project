'use strict';

const spotImages = [
  {
    spotId: 1,
    url: 'spotImage url 1',
    preview: true,
  },
  {
    spotId: 2,
    url: 'spotImage url 2',
    preview: false,
  },
  {
    spotId: 3,
    url: 'spotImage url 3',
    preview: false,
  }
]
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('SpotImages', spotImages)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('SpotImages')
  }
};
