const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, sequelize } = require('../../db/models');

const router = express.Router();
/* --------------------------- ROUTERS -------------------------------*/



module.exports = router;
