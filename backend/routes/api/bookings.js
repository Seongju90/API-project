const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, sequelize, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { raw } = require('express');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();


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

// Edit a Booking
router.put('/:bookingId', requireAuth, async(req, res, next) => {
    const userId = req.user.id;
    const bookingId = req.params.bookingId;
    res.json(bookingId)

    // const bookingToEdit = await Booking.findByPk(bookingId)

    // if (bookingToEdit.userId === userId) {
    //     res.json('success')
    // }
})


// if exporting in an object must destruct out of same object
module.exports = router
