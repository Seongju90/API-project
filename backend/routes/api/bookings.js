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
    const { startDate, endDate } = req.body

    let booking = await Booking.findByPk(bookingId)

    if (!booking) {
        res.status(404)
        res.json({
            "message": "Booking couldn't be found",
            "statusCode": 404
        })
    }

    const reqStartDate = Date.parse(startDate)
    const reqEndDate = Date.parse(endDate)
    const bookingStartDate = Date.parse(booking.startDate)
    const bookingEndDate = Date.parse(booking.endDate)
    const todayDate = Date.parse(new Date())

   if (reqEndDate <= reqStartDate) {
        res.status(400)
        res.json({
            "message": "Validation error",
            "statusCode": 400,
            "errors": {
              "endDate": "endDate cannot come before startDate"
            }
        })
   }

   if (todayDate >= bookingEndDate) {
        res.status(403)
        res.json({
            "message": "Past bookings can't be modified",
            "statusCode": 403
        })
   }

   if (reqStartDate >= bookingStartDate && reqStartDate <= bookingEndDate) {
        res.status(403)
        res.json({
            "message": "Sorry, this spot is already booked for the specified dates",
            "statusCode": 403,
            "errors": {
              "startDate": "Start date conflicts with an existing booking",
            }
        })
    }

   if (reqEndDate >= bookingStartDate && reqEndDate <= bookingEndDate) {
        res.status(403)
        res.json({
            "message": "Sorry, this spot is already booked for the specified dates",
            "statusCode": 403,
            "errors": {
               "endDate": "End date conflicts with an existing booking",
            }
        })
    }

    if (userId === booking.userId) {
        booking.set({
            startDate,
            endDate
        })
    }

    await booking.save()

    res.json(booking)
})

router.delete('/:bookingId', requireAuth, async(req, res, next) => {
    const userId = req.user.id;
    const bookingId = req.params.bookingId;
    const todayDate = Date.parse(new Date())

    // don't forget to turn to json please
    let booking = await Booking.findByPk(bookingId)

    // Error response: Couldn't find a Booking with the specified id
    if (!booking) {
        res.status(404)
        res.json({
            "message": "Booking couldn't be found",
            "statusCode": 404
        })
    }

    // parse to JSON to get raw data to compare dates
    let bookingJson = booking.toJSON()
    const parsedStartDate = Date.parse(bookingJson.startDate)
    // Error response: Bookings that have been started can't be deleted
    if (todayDate >= parsedStartDate) {
        console.log("success")
        res.status(403)
        res.json({
            "message": "Bookings that have been started can't be deleted",
            "statusCode": 403
        })
    }

    // Booking must belong to the current user or the Spot must belong to the current user
    if (userId === booking.userId && todayDate <= parsedStartDate) {
        await booking.destroy()
        res.json({
            "message": "Successfully deleted",
            "statusCode": 200
        })
    }
})


// if exporting in an object must destruct out of same object in other file {} = require
module.exports = router
