const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, sequelize, ReviewImage } = require('../../db/models');
const { raw } = require('express');

const router = express.Router();

/* --------------------------- ROUTERS -------------------------------*/

// Get all of the Current User's Bookings
router.get('/current', requireAuth, async(req, res, next) => {
    res.json('success')
})


module.exports = router
