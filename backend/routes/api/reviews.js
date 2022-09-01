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
        ],
        raw: true,
        // if you have associations with include that gets flatten, use nest parameter to counter that.
        nest: true
    })

    // for (let review of reviews) {
    //     // find the spot where the ID of spot is connected to spotID review
    //     let spot = await Spot.findOne({
    //         where: {
    //             id: review.spotId
    //         },
    //         raw: true
    //     });

    //     let spotImg = await SpotImage.findAll({
    //         where: {
    //             spotId: spot.id
    //         },
    //         raw: true
    //     });


    //     res.json(spotImg)

    // }



    // res.json({Reviews: reviews})
})

module.exports = router;
