const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Review, ReviewImage } = require('../../db/models');

const router = express.Router();

/* --------------------------- ROUTERS -------------------------------*/

router.delete('/:imageId', requireAuth, async(req, res, next) => {
    const userId = req.user.id;
    const imageId = req.params.imageId;

    const reviewImage = await ReviewImage.findByPk(imageId)
    // Error response: Couldn't find a Review Image with the specified id
    if (!reviewImage) {
        res.status(404)
        res.json({
            "message": "Review Image couldn't be found",
            "statusCode": 404
        })
    }

    const review = await Review.findByPk(reviewImage.reviewId)

    // Review must belong to the current user
    if (userId === review.userId) {
        await reviewImage.destroy()

        res.json({
            "message": "Successfully deleted",
            "statusCode": 200
        })
    }
})

module.exports = router;
