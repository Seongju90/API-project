const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, sequelize } = require('../../db/models');

const router = express.Router();

router.get('/', async(req, res, next) => {

    let spots = await Spot.findAll({
        include: {
            model: SpotImage,
            attributes: ['url']
        },
        group: ['SpotImages.url']
    })

    let avgRatingData = await Spot.findAll({
        attributes: {
            include: [
                [
                    sequelize.fn("AVG", sequelize.col("Reviews.stars")),
                    "avgRating"
                ]
            ],
        },
        include: {
            model: Review,
            attributes: []
        },
        group: ['Reviews.stars']
    })

    avgRatingData = avgRatingData.toJSON()
    spots = spots.toJSON()
    Object.assign(spots, avgRatingData)

    res.json({Spots: spots})
});

















module.exports = router;
