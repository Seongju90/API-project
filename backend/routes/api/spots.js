const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot } = require('../../db/models');

const router = express.Router();

router.get('/', async(req, res, next) => {
    const spots = await Spot.findAll()

    res.json(spots)
})


















module.exports = router;
