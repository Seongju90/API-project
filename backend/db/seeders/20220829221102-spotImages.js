'use strict';

const spotImages = [
  {
    spotId: 1,
    url: 'https://a0.muscache.com/im/pictures/miso/Hosting-44395056/original/fc6ed7c2-c5a9-4b5f-af13-305d7984b238.jpeg?im_w=720',
    preview: true,
  },
  {
    spotId: 2,
    url: 'https://a0.muscache.com/im/pictures/fe49a8d8-18c1-43da-9935-f12dd279a4a2.jpg?im_w=720',
    preview: true,
  },
  {
    spotId: 3,
    url: 'https://a0.muscache.com/im/pictures/c4c92198-fb3a-4c4b-bbb6-3aa8af8f7e73.jpg?im_w=720',
    preview: true,
  },
  {
    spotId: 4,
    url: 'https://a0.muscache.com/im/pictures/85d647f8-2c72-4082-b78a-c777ece382eb.jpg?im_w=720',
    preview: true,
  },
  {
    spotId: 5,
    url: 'https://a0.muscache.com/im/pictures/miso/Hosting-25626876/original/798706e1-bb63-43a0-9f83-4cef99a1df6d.jpeg?im_w=720',
    preview: true,
  },
  {
    spotId: 6,
    url: 'https://a0.muscache.com/im/pictures/9fbe8e54-0434-4aa2-a943-e04c1a421d9e.jpg?im_w=720',
    preview: true,
  },
  {
    spotId: 7,
    url: 'https://a0.muscache.com/im/pictures/miso/Hosting-44106940/original/66a4178c-8c97-4a18-80fb-1da7842a2f9a.jpeg?im_w=720',
    preview: true,
  },
  {
    spotId: 8,
    url: 'https://a0.muscache.com/im/pictures/miso/Hosting-29417765/original/ba764a9c-03b5-43d1-ac74-88d77ead7691.jpeg?im_w=720',
    preview: true,
  },
  {
    spotId: 9,
    url: 'https://a0.muscache.com/im/pictures/1f6c495e-b877-4a48-9f2c-d8012f640166.jpg?im_w=720',
    preview: true,
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
