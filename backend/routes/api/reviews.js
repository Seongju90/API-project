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

// Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const userId = req.user.id
    const reviewId = req.params.reviewId
    const { url } = req.body

    const reviews = await Review.findByPk(reviewId)

    if(!reviews) {
        res.status(404)
        res.json({
            "message": "Review couldn't be found",
            "statusCode": 404
        })
    }

    const reviewImages = await ReviewImage.findAll({
        where: {
            reviewId
        },
        raw: true
    })

    if (reviewImages.length > 10) {
        res.status(403)
        res.json({
            "message": "Maximum number of images for this resource was reached",
            "statusCode": 403
        })
    }

    let newReviewImage = await ReviewImage.create({
        url
    })

    // formatting the response
    newReviewImage = newReviewImage.toJSON()
    delete newReviewImage["createdAt"]
    delete newReviewImage["updatedAt"]

    res.json(newReviewImage)
})

// Edit a Review
router.put('/:reviewId', requireAuth, async(req, res, next) => {
    const userId = req.user.id;
    const reviewId = req.params.reviewId
    const { review , stars} = req.body

    const reviews = await Review.findByPk(reviewId)

    if (!reviews) {
        res.status(404)
        res.json({
            "message": "Review couldn't be found",
            "statusCode": 404
        })
    }

    if (userId === reviews.userId) {
        reviews.set({
            review,
            stars
        })

        await reviews.save()

        res.json(reviews)
    }
    // handle body validation errors later
})

// Delete a Review
router.delete('/:reviewId', requireAuth, async(req, res, next) => {
    const userId = req.user.id;
    const reviewId = req.params.reviewId
    const reviewToDestroy = await Review.findByPk(reviewId)

    if (!reviewToDestroy) {
        res.status(404)
        res.json({
            "message": "Review couldn't be found",
            "statusCode": 404
          })
    }

    if (userId === reviewToDestroy.userId) {
        await reviewToDestroy.destroy()
        res.json({
            "message": "Successfully deleted",
            "statusCode": 200
        })
    }
})
module.exports = router;
