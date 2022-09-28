'use strict';

const bookings = [
  {
    spotId: 1,
    userId: 1,
    startDate: "2022-10-02",
    endDate: "2022-10-09",
  },
  {
    spotId: 2,
    userId: 2,
    startDate: "2022-11-03",
    endDate: "2022-11-07",
  },
  {
    spotId: 3,
    userId: 3,
    startDate: "2022-05-04",
    endDate: "2022-05-11",
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
