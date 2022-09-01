const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Review, ReviewImage } = require('../../db/models');

const router = express.Router();

/* --------------------------- ROUTERS -------------------------------*/

router.delete('/:imageId', requireAuth, async(req, res, next) => {
    const userId = req.user.id;
    const imageId = req.params.imageId
})

module.exports = router;
