const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, sequelize, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { raw } = require('express');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateBookings = [
    check('startDate')
        .exists({ checkFalsy: true})
        .isAfter(new Date())
        .withMessage("Start date must be in the future"),
    check('endDate')
        .exists({ checkFalsy: true})
        .isAfter('startDate')
        .withMessage("endDate cannot be on or before startDate"),
    handleValidationErrors
];

/* --------------------------- ROUTERS -------------------------------*/

// Get all of the Current User's Bookings
router.get('/current', requireAuth, async(req, res, next) => {
    const userId = req.user.id

    const bookings = await Booking.findAll({
        where: {
            userId
        },
        include: {
            model: Spot,
            attributes: {exclude: ['description', 'createdAt', 'updatedAt']}
        },
        raw: true,
        nest: true
    })

   // iterate through the bookings to get the spotId
   for (let booking of bookings) {
        let spotId = booking.spotId

        let spot = await Spot.findByPk(spotId)
        spot = spot.toJSON()

        const spotImages = await SpotImage.findAll({
            where: {
                spotId
            }
        })

        for (spotImage of spotImages) {
            booking.Spot.previewImage = spotImage.url
        }
   }

    res.json({Bookings: bookings})
})


module.exports = {
    router,
    validateBookings
}
