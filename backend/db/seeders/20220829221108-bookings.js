'use strict';

const bookings = [
  {
    spotId: 1,
    userId: 1,
    startDate: '02 Oct 2022',
    endDate: '05 Oct 2022',
  },
  {
    spotId: 2,
    userId: 2,
    startDate: '02 Feb 2022',
    endDate: '06 Feb 2022',
  },
  {
    spotId: 3,
    userId: 3,
    startDate: '24 Dec 2022',
    endDate: '30 Dec 2022',
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
   await queryInterface.bulkInsert("Bookings", bookings)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete("Bookings")
  }
};
