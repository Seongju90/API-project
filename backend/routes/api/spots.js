const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, sequelize } = require('../../db/models');

const router = express.Router();

router.get('/', async(req, res, next) => {

    let avgRatings = await Spot.findAll({
        attributes: {
            include: [
                [
                    sequelize.fn("AVG", sequelize.col("Reviews.stars")),
                    "avgRating"
                ]
            ],
        },
        include: [
            {
                model: Review,
                attributes: []
            },
            {
                model: SpotImage,
                attributes: [],
                where: {
                    preview: true
                }
            }
        ],
        group: ['Reviews.stars'],
        raw: true
    })

    let spots = await SpotImage.findAll({
        where: {
            preview: true
        },
        raw: true
    })

    // avgRatings.forEach(rating => {
    //     rating.previewImage = 5
    // })

    // res.json({Spots: avgRatings})
    res.json(spots)
});

















module.exports = router;
