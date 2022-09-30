const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { check, query } = require('express-validator');
const { User, Spot, Review, SpotImage, sequelize, ReviewImage, Booking } = require('../../db/models');
const { raw } = require('express');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');
const e = require('express');

const router = express.Router();

/* -------------------------- VALIDATIONS --------------------------- */
const validateSpot = [
    check('address')
        // fields with falsy values will also not exist, different then undefined
        .exists({ checkFalsy: true })
        .isAlphanumeric('en-US', {ignore: ' '}) // ignore ' ' will ignore white space
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .isAlpha('en-US', {ignore: ' '})
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .isAlpha('en-US', {ignore: ' '})
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .isAlpha('en-US', {ignore: ' '})
        .withMessage('Country is required'),
    check('lat')
        .isDecimal() // check if STRING represents decimal number
        .withMessage('Latitude is not valid'),
    check('lng')
        .isDecimal()
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .isAlpha('en-US', {ignore: ' '})
        .isLength({max: 49})
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .isNumeric() // check only for numbers
        .withMessage('Price per day is required'),
    handleValidationErrors
]

const validateReview = [
    check('review')
        .exists({checkFalsy: true})
        .isLength({min: 10, max: 255})
        .withMessage('Review must have 1 to 255 letters'),
    check('stars')
        .isFloat({min:0 , max:5})
        .withMessage('Stars can only be from 1 to 5'),
    handleValidationErrors
]

// isDecimal does not have min max options, isFloat does.
// this will only check to see if query parameters are valid, it will not search the database
// must write a custom validation to search the DB.
const validateQuery = [
    query('minLat')
        .isDecimal()
        // optional makes the query paramter optional, checkfalsy=true to make 0 a valid parameter.
        .optional({checkFalsy: true})
        .withMessage("Minimum latitude is invalid"),
    query('maxLat')
        .isDecimal()
        .optional({checkFalsy: true})
        .withMessage("Maximum latitude is invalid"),
    query('minLng')
        .isDecimal()
        .optional({checkFalsy: true})
        .withMessage("Minimum longitude is invalid"),
    query('maxLng')
        .isDecimal()
        .optional({checkFalsy: true})
        .withMessage("Maximum longitude is invalid"),
    query('minPrice')
        .isFloat({min: 0})
        .optional({checkFalsy: true})
        .withMessage("Minimum price must be greater than or equal to 0"),
    query('maxPrice')
        .isFloat({min: 0})
        .optional({checkFalsy: true})
        .withMessage("Maximum price must be greater than or equal to 0"),
    handleValidationErrors
]

/* --------------------------- ROUTERS -------------------------------*/

// Get all spots
router.get('/', validateQuery, async(req, res, next) => {
    // Pagination

    let {page, size } = req.query

    if (!page) page = 1
    if (!size) size = 20

    if (page <= 0) {
        res.status(400)
        res.json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "page": "Page must be greater than or equal to 0"
            }
        })
    }
    if (size <= 0) {
        res.status(400)
        res.json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "size": "Size must be greater than or equal to 0"
            }
        })
    }

    // find all spots with pagination
    let spots = await Spot.findAll({

        raw: true,
        limit: size,
        offset: (page - 1) * size
    })

    // Add avgRating Data to Spot response
    for (let spot of spots) {

        // manually calculate avg because can't eagar load aggregate
        const numberReviews = await Review.count({
            where: {
                spotId: spot.id
            },
            raw: true
        })

        const totalReviews = await Review.sum('stars', {
            where: {
                spotId: spot.id
            },
            raw: true
        })

        // const avgRating = numberReviews[0].count / totalReviews *this doesn't work*
        const avgRating = numberReviews/ totalReviews
        spot.avgRating = avgRating
    }

    // Add previewImage to Spot response
    let spotImg = await SpotImage.findAll({
        where: {
            preview: true
        },
        raw: true
    })

    // loop through the return value of spots findAll = array
    spots.forEach(spot => {
        spotImg.forEach(img => {
            if (spot.id === img.spotId) {
                spot.previewImage = img.url
            }
        })
    });

    res.json({Spots: spots, page, size})
});

// Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res, next) => {
    // pulled from requireAuth -> restore User
    const userId = req.user.id

    let spots = await Spot.findAll({
        where: {
            ownerId: userId
        },
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
                attributes: []
            }
        ],
        group: ['Spot.id'],
        raw: true
    })

    let spotImg = await SpotImage.findAll({
        where: {
            preview: true
        },
        raw: true
    })

    // nested for loop inefficient
    spots.forEach(spot => {
        spotImg.forEach(img => {
            if (spot.id === img.spotId) {
                spot.previewImage = img.url
            }
        })
    });

    res.json({Spots: spots})
})

// Create a Spot
router.post('/', requireAuth, validateSpot, async (req, res, next) => {
    const userId = req.user.id;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    if (req.body) {
        const newSpot = await Spot.create({
            ownerId: userId,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        })

        res.json(newSpot)
    }
});

// Get details of a Spot from an id
router.get('/:spotId', async (req, res, next) => {
    const id = req.params.spotId
    let spot = await Spot.findByPk(id)

    if (spot) {
        //change to json in order to add properties
        let spotJson = spot.toJSON()

        // find num of reviews of spot and add it to json object
        let numReview = await Review.count({
            where: {
                spotId: id
            },
            raw: true
        });

        spotJson.numReview = numReview;

        // find sum of stars of the current spot
        let sumReview = await Review.sum('stars', {
            where: {
                spotId: id
            },
            raw: true
        });

        // calculate avgstar by # of reviews / # of stars total
        spotJson.avgStarRating = numReview / sumReview;

        // add spotImages to the response excluding some attributes
        let spotImages = await SpotImage.findAll({
            where: {
                spotId: id
            },
            attributes: {exclude: ['createdAt', 'updatedAt', 'spotId']}
        })

        spotJson.SpotImages = spotImages;

        // find owner attributes and add to json response
        let owner = await User.findByPk(spotJson.ownerId, {
            attributes: ['id', 'firstName', 'lastName']
        });

        spotJson.Owner = owner;


        res.json(spotJson)
    } else {
        res.status(404)
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
})

// Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async(req, res, next) => {
    const userId = req.user.id
    const spotId = req.params.spotId;
    const { url, preview } = req.body;

    const spot = await Spot.findByPk(spotId)

    // if spot doesn't exists throw an error
    if (!spot) {
        res.status(404)
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    // if user is not the owner of the spot throw authorization error
    if (userId !== spot.ownerId) {
        res.status(403)
        res.json({
            message: "You do not have authorization to add images to this spot",
            statusCode: 403
        })
    }

    // if yes, then iterate through all images of the spot, find the old preview image, and update the
    // boolean to be false then, add new image as preview image
    if (preview === true) {

        const spotImgs = await SpotImage.findAll({
            where: {
                spotId
            },
            // raw: true
        })

        // Because we need to change existing data in the database we need set and save!
        // comment out raw:true because set and save method only work with promises!
        for (let img of spotImgs) {
            if (img.preview === true) {
                // set the preview to false
                img.set({
                    preview: false
                })

                await img.save()
            }
        }
    }

    // After updating data create a new image and send it after formatting, if preview = false it
    // jumps straight to this line of code
    const spotImg = await SpotImage.create({
        spotId,
        url,
        preview
    })

    let spotImgJson = spotImg.toJSON()
     // query for the new spot to edit format of the response
     let formatSpotImg = await SpotImage.findByPk(spotImgJson.id, {
        attributes: ['id', 'url', 'preview']
    })
    res.json(formatSpotImg)
});

// Edit a Spot
router.put('/:spotId', requireAuth, validateSpot, async(req, res, next) => {
    const userId = req.user.id;
    const spotId = req.params.spotId;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const spot = await Spot.findByPk(spotId)

    // if spot doesnt exists
    if(!spot) {
        res.status(404)
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    // if userId is not the owner of the spot
    if(userId !== spot.ownerId) {
        res.status(401)
        res.json({
            "messsage": "Unauthorized User",
            "statusCode": 401,
        })
    }

    // check if spot to be updated exists and if spot belongs to current user
    if(spot && userId === spot.ownerId) {
        spot.set({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        })
        // set values then save!
        await spot.save()
        res.json(spot)
    }
})

// Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res, next) => {
    const spotId = req.params.spotId;

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    const reviews = await Review.findAll({
        where: {
            spotId
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    })

    res.json({Reviews: reviews})
})

// Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
    const userId = req.user.id;
    const spotId = req.params.spotId;
    const { review, stars } = req.body

    const spot = await Spot.findByPk(spotId)

    if (!spot) {
        res.status(404)
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    // queried for existing review with userId && spotId
    const existingReview = await Review.findOne({
        where: {
            userId,
            spotId
        }
    })

    if (existingReview) {
        res.status(403)
        res.json({
            "message": "User already has a review for this spot",
            "statusCode": 403
          })
    }

    // if I have req body make a new review
    if (req.body) {
        const newReview = await Review.create({
            userId,
            spotId,
            review,
            stars
        })
        res.json(newReview)
    } else {
        // need to make custom validators for sequelize later
        res.status(400)
        res.json({
            "message": "Validation error",
            "statusCode": 400,
            "errors": {
              "review": "Review text is required",
              "stars": "Stars must be an integer from 1 to 5",
            }
        })
    }
})

// Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async(req, res, next) => {
    const spotId = req.params.spotId
    const userId = req.user.id
    const spot = await Spot.findByPk(spotId)

    if(!spot) {
        res.status(404)
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    // need this below the if statement above because the functions below depend on
    // ownerID to exist
    const ownerId = spot.ownerId

    // if the user isn't the owner we want to find all bookings
    if(userId !== ownerId) {
        const bookings = await Booking.findAll({
            where: {
                spotId
            },
            attributes: ['spotId', 'startDate', 'endDate']
        })

        res.json({Bookings: bookings})
    }

    // if user is the owner we want a different structured response
    if(userId === ownerId) {
        const bookings = await Booking.findAll({
            where: {
                spotId
            },
            include: {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }
        })

        res.json({Bookings: bookings})
    }
})

// Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, async(req, res, next) => {
    const userId = req.user.id
    const spotId = req.params.spotId

    const { startDate, endDate } = req.body
    const spot = await Spot.findByPk(spotId)

    // If spot doesn't exist throw an error
    if (!spot) {
        res.status(404)
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    // Spot must NOT belong to the current user
    if (userId === spot.ownerId) {
        res.status(403)
        res.json({
            "message": "Spot must not belong to the current user",
            "statusCode": 403
        })
    }

    // endDate cannot be on or before startDate
    if (endDate <= startDate) {
        res.status(404)
        res.json({
            "message": "Validation error",
            "statusCode": 400,
            "errors": {
            "endDate": "endDate cannot be on or before startDate"
            }
        })
    }

    // find all the bookings
    let existingBookings = await Booking.findAll({
        where: {
            spotId
        },
        raw:true
    })

    for (let booking of existingBookings) {
        // parse the existing and user.req dates to compare values
        let existingStartDate = Date.parse(booking.startDate)
        let existingEndDate = Date.parse(booking.endDate)
        let startDateParsed = Date.parse(startDate)
        let endDateParsed = Date.parse(endDate)

        // create and empty error object
        const err = [];
        if (startDateParsed >= existingStartDate && startDateParsed <= existingEndDate) {
            err.push("Start date conflicts with an existing booking")
        }

        if (endDateParsed >= existingStartDate && endDateParsed <= existingEndDate) {
           err.push("End date conflicts with an existing booking")
        }

        if (err.length) {
            // create an error object
            const errorResponse = {}
            errorResponse.message = "Sorry, this spot is already booked for the specified dates";
            errorResponse.statusCode = 403;
            errorResponse.errors = {};
            // because errors is nested, create another object
            for (let error of err) {
                // checking if my error messages has the word Start to differentiate start and end date
                // note to self: includes() is case-sensitive
                if (error.includes('Start')) {
                    errorResponse.errors.startDate = error
                } else {
                    errorResponse.errors.endDate = error
                }
            }
        res.status(403)
        res.json(errorResponse)
        }
    }

    const newBooking = await Booking.create({
        spotId,
        userId,
        startDate,
        endDate
    })

    res.json(newBooking)
});

// Delete a Spot
router.delete('/:spotId', requireAuth, async(req, res, next) => {
    const userId = req.user.id;
    const spotId = req.params.spotId;

    // check to see if spot to be delete exists
    const spotToDestroy = await Spot.findByPk(spotId)

    if (!spotToDestroy) {
        res.status(404)
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    // if spot exists and the user is the owner of the spot
    if (userId === spotToDestroy.ownerId) {
        await spotToDestroy.destroy()
        res.json({
            "message": "Successfully deleted",
            "statusCode": 200
        })
    }
})

module.exports = router;

/*
--------------------CODE THAT WOULD WORK WITH SQLITE3 BUT NOT POSTGRESSQL------------

    ----------------------------------------------
    }
    let parsedMinLat = parseInt(minLat)
    let parsedMaxLat = parseInt(maxLat)
    let parsedMinLng = parseInt(minLng)
    let parsedMaxLng = parseInt(maxLng)
    let parsedMinPrice = parseInt(minPrice)
    let parsedMaxPrice = parseInt(maxPrice)
    // create where query
    const where = {};
    // check if its an integer OR (lat - rounded lat not zero) === decimal OR doesnt exist (optional)
    if (isNaN(parsedMinLat)) {
        1 === 1; // do nothing
    } else if (Number.isInteger(parsedMinLat) || (parsedMinLat - Math.floor(parsedMinLat)) !== 0) {
        where.parsedMinLat = parsedMinLat
    } else {
        res.status(400)
        res.json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "minLat": "Minimum latitude is invalid",
            }
        })
    }

    if (isNaN(parsedMaxLat)) {
        1 === 1; // do nothing
    } else if (Number.isInteger(parsedMaxLat) || (parsedMaxLat - Math.floor(parsedMaxLat)) !== 0 || undefined) {
        where.parsedMaxLat = parsedMaxLat
    } else {
        res.status(400)
        res.json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "maxLat": "Maximum latitude is invalid",
            }
        })
    }

    if (isNaN(parsedMinLng)) {
        1 === 1; // do nothing
    } else if (Number.isInteger(parsedMinLng) || (parsedMinLng - Math.floor(parsedMinLng)) !== 0 || undefined) {
        where.parsedMinLng = parsedMinLng
    } else {
        res.status(400)
        res.json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "minLng": "Maximum longitude is invalid"
            }
        })
    }

    if (isNaN(parsedMaxLng)) {
        1 === 1; // do nothing
    } else if (Number.isInteger(parsedMaxLng) || (parsedMaxLng - Math.floor(parsedMaxLng)) !== 0 || undefined) {
        where.parsedMaxLng = parsedMaxLng
    } else {
        res.status(400)
        res.json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "maxLng": "Minimum longitude is invalid"
            }
        })
    }

    if (isNaN(parsedMinPrice)) {
        1 === 1; // do nothing
    } else if ((Number.isInteger(parsedMinPrice) || (parsedMinPrice - Math.floor(parsedMinPrice)) !== 0 || undefined)
        && parsedMinPrice >= 0) {
        where.parsedMinPrice = parsedMinPrice
    } else {
        res.status(400)
        res.json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "minPrice": "Minimum price must be greater than or equal to 0"
            }
        })
    }

    if (isNaN(parsedMaxPrice)) {
        1 === 1; // do nothing
    } else if ((Number.isInteger(parsedMaxPrice) || (parsedMaxPrice - Math.floor(parsedMaxPrice)) !== 0 || undefined)
        && parsedMaxPrice >= 0) {
        where.parsedMaxPrice = parsedMaxPrice
    } else {
        res.status(400)
        res.json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "maxPrice": "Maximum price must be greater than or equal to 0"
            }
        })
    }
    */

/*
// @@@@@@@@ POSTGRESS WONT LET YOU STORE NaN as a value FIND DIFFERENT WAY @@@@@@@@@@@

        // let parsedMinLat = parseInt(minLat)
        // let parsedMaxLat = parseInt(maxLat)
        // let parsedMinLng = parseInt(minLng)
        // let parsedMaxLng = parseInt(maxLng)
        // let parsedMinPrice = parseInt(minPrice)
        // let parsedMaxPrice = parseInt(maxPrice)
        // // create where query
        // const where = {};
        // // check if its an integer OR (lat - rounded lat not zero) === decimal OR doesnt exist (optional)
        // if (isNaN(parsedMinLat)) {
        //     1 === 1; // do nothing
        // } else if (Number.isInteger(parsedMinLat) || (parsedMinLat - Math.floor(parsedMinLat)) !== 0) {
        //     where.parsedMinLat = parsedMinLat
        // } else {
        //     res.status(400)
        //     res.json({
        //         "message": "Validation Error",
        //         "statusCode": 400,
        //         "errors": {
        //             "minLat": "Minimum latitude is invalid",
        //         }
        //     })
        // }

        // if (isNaN(parsedMaxLat)) {
        //     1 === 1; // do nothing
        // } else if (Number.isInteger(parsedMaxLat) || (parsedMaxLat - Math.floor(parsedMaxLat)) !== 0 || undefined) {
        //     where.parsedMaxLat = parsedMaxLat
        // } else {
        //     res.status(400)
        //     res.json({
        //         "message": "Validation Error",
        //         "statusCode": 400,
        //         "errors": {
        //             "maxLat": "Maximum latitude is invalid",
        //         }
        //     })
        // }

        // if (isNaN(parsedMinLng)) {
        //     1 === 1; // do nothing
        // } else if (Number.isInteger(parsedMinLng) || (parsedMinLng - Math.floor(parsedMinLng)) !== 0 || undefined) {
        //     where.parsedMinLng = parsedMinLng
        // } else {
        //     res.status(400)
        //     res.json({
        //         "message": "Validation Error",
        //         "statusCode": 400,
        //         "errors": {
        //             "minLng": "Maximum longitude is invalid"
        //         }
        //     })
        // }

        // if (isNaN(parsedMaxLng)) {
        //     1 === 1; // do nothing
        // } else if (Number.isInteger(parsedMaxLng) || (parsedMaxLng - Math.floor(parsedMaxLng)) !== 0 || undefined) {
        //     where.parsedMaxLng = parsedMaxLng
        // } else {
        //     res.status(400)
        //     res.json({
        //         "message": "Validation Error",
        //         "statusCode": 400,
        //         "errors": {
        //             "maxLng": "Minimum longitude is invalid"
        //         }
        //     })
        // }

        // if (isNaN(parsedMinPrice)) {
        //     1 === 1; // do nothing
        // } else if ((Number.isInteger(parsedMinPrice) || (parsedMinPrice - Math.floor(parsedMinPrice)) !== 0 || undefined)
        //     && parsedMinPrice >= 0) {
        //     where.parsedMinPrice = parsedMinPrice
        // } else {
        //     res.status(400)
        //     res.json({
        //         "message": "Validation Error",
        //         "statusCode": 400,
        //         "errors": {
        //             "minPrice": "Minimum price must be greater than or equal to 0"
        //         }
        //     })
        // }

        // if (isNaN(parsedMaxPrice)) {
        //     1 === 1; // do nothing
        // } else if ((Number.isInteger(parsedMaxPrice) || (parsedMaxPrice - Math.floor(parsedMaxPrice)) !== 0 || undefined)
        //     && parsedMaxPrice >= 0) {
        //     where.parsedMaxPrice = parsedMaxPrice
        // } else {
        //     res.status(400)
        //     res.json({
        //         "message": "Validation Error",
        //         "statusCode": 400,
        //         "errors": {
        //             "maxPrice": "Maximum price must be greater than or equal to 0"
        //         }
        //     })
        // }
*/
