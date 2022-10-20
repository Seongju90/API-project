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
    price: 80,
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
  },
  {
    ownerId: 2,
    address: '111 Sunset Drive',
    city: 'Beach',
    state: 'TX',
    country: 'USA',
    lat: 50,
    lng: 100,
    name: 'Sunset',
    description: 'Best place to watch the sunset, not the sunrise',
    price: 150,
  },
  {
    ownerId: 3,
    address: '340 Nonghyang Road',
    city: 'Seoul',
    state: 'Soul',
    country: 'Korea',
    lat: 40,
    lng: 100,
    name: 'Soul Food',
    description: 'House located near best soul foods',
    price: 200
  },
  {
    ownerId: 1,
    address: '9999 Parry Road',
    city: 'Rockhill',
    state: 'NY',
    country: 'USA',
    lat: 60,
    lng: 78,
    name: 'Volcano',
    description: 'Place to rest in peace',
    price: 80
  },
  {
    ownerId: 2,
    address: '1234 Numbers Street',
    city: 'Integer',
    state: 'FL',
    country: 'USA',
    lat: 90,
    lng: 100,
    name: 'Numbers Galore',
    description: 'Numbers in Pool',
    price: 145
  },
  {
    ownerId: 3,
    address: '398 ABC Drive',
    city: 'Alphabet',
    state: 'CA',
    country: 'USA',
    lat: 80,
    lng: 20,
    name: 'Love the View',
    description: 'Nice place to take a break from coding',
    price: 90
  },
  {
    ownerId: 3,
    address: '489 Tootaloo Drive',
    city: 'Super',
    state: 'NV',
    country: 'USA',
    lat: 40,
    lng: 80,
    name: 'Come now, stay forever',
    description: 'You will never want to go home',
    price: 245
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
