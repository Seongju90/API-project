const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, sequelize, ReviewImage } = require('../../db/models');

const router = express.Router();
/* --------------------------- ROUTERS -------------------------------*/

router.get('/current', requireAuth, async (req, res, next) => {
    // const userId = req.user.id;
    const userId = 3

    // eager load all the reviews where current user has
    let reviews = await Review.findAll({
        where: {
            userId,
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: {exclude: ['createdAt', 'updatedAt', 'description']}
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ],
        raw: true,
        // if you have associations with include that gets flatten, use nest parameter to counter that.
        nest: true
    })

    // adding previewImage to Spot in the response
    for (let review of reviews) {
        // find the spot where the ID of spot is connected to spotID review
        let spot = await Spot.findOne({
            where: {
                id: review.spotId
            },
            raw: true
        });

        // finding all the spotImages where spotId matches
        let spotImgs = await SpotImage.findAll({
            where: {
                spotId: spot.id
            },
            raw: true
        });

        // foreach image, if the spot id matches the spot, I want to add previewImage with spot img url
        spotImgs.forEach(spotImg => {
            if (spotImg.spotId === spot.id) {
                review.Spot.previewImage = spotImg.url
            }
        })

        // shove the review images in an array
        review.ReviewImages = [review.ReviewImages]
    }

    res.json({Reviews: reviews})
})


module.exports = router;
