'use strict';

const bookings = [
  {
    spotId: 1,
    userId: 1,
    startDate: '2022-10-02',
    endDate: '2022-10-04',
  },
  {
    spotId: 2,
    userId: 2,
    startDate: '2022-11-02',
    endDate: '2022-11-05',
  },
  {
    spotId: 3,
    userId: 3,
    startDate: '2022-12-06',
    endDate: '2022-12-09',
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
