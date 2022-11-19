const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, sequelize, ReviewImage } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');

const router = express.Router();

const validateReview = [
    check('review')
        .exists({checkFalsy: true})
        .isLength({min: 10, max: 255})
        .withMessage('Review must have 10 to 255 letters'),
    check('stars')
        .isFloat({min:1 , max:5})
        .withMessage('Stars can only be from 1 to 5'),
    handleValidationErrors
]

/* --------------------------- ROUTERS -------------------------------*/

router.get('/current', requireAuth, async (req, res, next) => {
    const userId = req.user.id;

    // eager load all the reviews where current user has
    let reviews = await Review.findAll({
        where: {
            userId
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
        // returns raw data of promises
        raw: true,
        // associations with include become flatten, to counteract that we use
        // the nest: true
        nest: true
    })

    // adding previewImage to Spot in the response
    for (let review of reviews) {
        // finding all the spotImages where spotId matches
        let spotImgs = await SpotImage.findAll({
            where: {
                // review.Spot.id because if you flatten the first query, Spot.id is a key in the object
                spotId: review.Spot.id
            },
            raw: true
        });

        // foreach image, if the spot id matches the spot, I want to add previewImage with spot img url
        spotImgs.forEach(spotImg => {
            if (spotImg.spotId === review.Spot.id) {
                review.Spot.previewImage = spotImg.url
            }
        })
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

    // Review must belong to the current user
    if (userId === reviews.userId) {
        let newReviewImage = await ReviewImage.create({
            reviewId,
            url
        })

        // formatting the response
        newReviewImage = newReviewImage.toJSON()
        delete newReviewImage['reviewId']
        delete newReviewImage["createdAt"]
        delete newReviewImage["updatedAt"]

        res.json(newReviewImage)
    }
})

// Edit a Review
router.put('/:reviewId', requireAuth, validateReview, async(req, res, next) => {
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
