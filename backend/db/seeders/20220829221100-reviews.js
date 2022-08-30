'use strict';

const reviews = [
  {
    userId: 1,
    spotId: 1,
    review: 'This place was great!',
    stars: 5,
  },
  {
    userId: 2,
    spotId: 2,
    review: 'This place was okay...could have been better',
    stars: 3,
  },
  {
    userId: 3,
    spotId: 3,
    review: 'I will never come back to this place ever',
    stars: 1,
  },
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
   await queryInterface.bulkInsert('Reviews', reviews)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Reviews')
  }
};
