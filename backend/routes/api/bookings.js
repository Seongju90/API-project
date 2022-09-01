const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, sequelize, ReviewImage, Booking } = require('../../db/models');
const { raw } = require('express');

const router = express.Router();

/* --------------------------- ROUTERS -------------------------------*/

// Get all of the Current User's Bookings
router.get('/current', requireAuth, async(req, res, next) => {
    // const userId = req.user.id
    const userId = 1

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


module.exports = router
