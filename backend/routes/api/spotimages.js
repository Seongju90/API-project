const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage } = require('../../db/models');

const router = express.Router();

/* --------------------------- ROUTERS -------------------------------*/

router.delete('/:imageId', requireAuth, async(req, res, next) => {
    const userId = req.user.id;
    const imageId = req.params.imageId;

    const image = await SpotImage.findByPk(imageId)
    if (!image) {
        res.status(404)
        res.json({
            "message": "Spot Image couldn't be found",
            "statusCode": 404
        })
    }

    const spot = await Spot.findByPk(image.spotId)

    if (userId === spot.ownerId ) {
        await image.destroy()

        res.json({
            "message": "Successfully deleted",
            "statusCode": 200
        })
    }
})

module.exports = router;
