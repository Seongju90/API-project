'use strict';

const spots = [
  {
    ownerId: 1,
    address: '911 Coding Dr.',
    city: 'Yikes',
    state: 'CA',
    country: 'USA',
    lat: 100,
    lng: 100,
    name: 'Coding Police',
    description: 'House of suited for developers who catch bad coders',
    price: 100,
  },
  {
    ownerId: 2,
    address: '112 Gaming Dr.',
    city: 'PC',
    state: 'NY',
    country: 'USA',
    lat: 50,
    lng: 50,
    name: 'Land of Gamers',
    description: 'House suited for gaming nerds',
    price: '80',
  },
  {
    ownerId: 3,
    address: '000 Sleeping Dr',
    city: 'Bed',
    state: 'CA',
    country: 'USA',
    lat: 100,
    lng: 90,
    name: 'Heavenly Beds',
    description: 'Quiet house suited for sensitive sleepers',
    price: 120,
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
   await queryInterface.bulkInsert('Spots', spots)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('Spots')
  }
};
