'use strict';

const reviews = [
  {
    userId: 2,
    spotId: 1,
    review: 'This place was great!',
    stars: 5,
  },
  {
    userId: 1,
    spotId: 2,
    review: 'This place was okay...could have been better',
    stars: 3,
  },
  {
    userId: 1,
    spotId: 3,
    review: 'I will never come back to this place ever',
    stars: 1,
  },
  {
    userId: 3,
    spotId: 2,
    review: 'So-So',
    stars: 4,
  },
  {
    userId: 2,
    spotId: 3,
    review: 'Great place to be on vacation',
    stars: 4,
  },
  {
    userId: 3,
    spotId: 1,
    review: 'Not to bad and not to good',
    stars: 3,
  },
  {
    userId: 1,
    spotId: 4,
    review: 'Great Sunset',
    stars: 5,
  },
  {
    userId: 1,
    spotId: 5,
    review: 'Not bad for the price',
    stars: 3,
  },
  {
    userId: 2,
    spotId: 6,
    review: 'Family enjoyed it, will come back',
    stars: 4,
  },
  {
    userId: 3,
    spotId: 7,
    review: 'Could not be any better, I think...',
    stars: 4,
  },
  {
    userId: 1,
    spotId: 8,
    review: 'Could not get any better than this',
    stars: 5,
  },
  {
    userId: 1,
    spotId: 9,
    review: 'Minor mishaps, but overall great',
    stars: 4,
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
