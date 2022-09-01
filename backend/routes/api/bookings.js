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
        include:
    })


    res.json(spot)
})


module.exports = router
