'use strict';
const {
  Model, DATE
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.hasMany(models.SpotImage, {foreignKey: 'spotId'})
      Spot.hasMany(models.Booking, {foreignKey: 'spotId'})
      Spot.hasMany(models.Review, {foreignKey: 'spotId'})
    }
  }
  Spot.init({
    ownerdId: DataTypes.NUMBER,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING,
    lat: DataTypes.NUMBER,
    lng: DataTypes.NUMBER,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
