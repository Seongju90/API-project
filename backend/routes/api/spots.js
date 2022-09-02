const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { User, Spot, Review, SpotImage, sequelize, ReviewImage, Booking } = require('../../db/models');
const { raw } = require('express');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const router = express.Router();

/* --------------------------- ROUTERS -------------------------------*/

// Get all spots
router.get('/', async(req, res, next) => {

    let spots = await Spot.findAll({
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
            },
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

    // loop through the return value of spots findAll = array
    spots.forEach(spot => {
        spotImg.forEach(img => {
            if (spot.id === img.spotId) {
                spot.previewImage = img.url
            }
        })
    });

    res.json({Spots: spots})
});

// Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res, next) => {
    // pulled from requireAuth -> restore User
    const userId = req.user.id

    //testing
    // const userId = 1

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
router.post('/', requireAuth, async (req, res, next) => {
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
    } else {
        // need to change this to sequelize validations later
        res.status(400)
        res.json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
              "address": "Street address is required",
              "city": "City is required",
              "state": "State is required",
              "country": "Country is required",
              "lat": "Latitude is not valid",
              "lng": "Longitude is not valid",
              "name": "Name must be less than 50 characters",
              "description": "Description is required",
              "price": "Price per day is required"
            }
          })
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
    const id = req.params.spotId;
    const { url, previewImage } = req.body;

    // if previewImage exists in Spot set that value to false then
    // add new SpotImage to that spot (LATER WE NEED THIS LOGIC)

    const spotExists = await Spot.findByPk(id)

    // if spot doesn't exists throw an error
    if (!spotExists) {
        res.status(404)
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    } else {
        // else create a new spotimage at that spot
        const newSpotImg = await SpotImage.create({
            spotId: id,
            url,
            preview: previewImage
        })

        let jsonSpotImg = newSpotImg.toJSON()
        // query for the new spot to edit format of the response
        let formatSpotImg = await SpotImage.findByPk(jsonSpotImg.id, {
            attributes: ['id', 'url', 'preview']
        })

        res.json(formatSpotImg)
    }
});

// Edit a Spot
router.put('/:spotId', requireAuth, async(req, res, next) => {
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
    } else {
        // need to setup sequelize validator errors here
        res.status(400)
        res.json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
              "address": "Street address is required",
              "city": "City is required",
              "state": "State is required",
              "country": "Country is required",
              "lat": "Latitude is not valid",
              "lng": "Longitude is not valid",
              "name": "Name must be less than 50 characters",
              "description": "Description is required",
              "price": "Price per day is required"
            }
        })
    };
})

// Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res, next) => {
    const spotId = req.params.spotId;

    // testing
    // const spotId = 1;

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
router.post('/:spotId/reviews', requireAuth, async (req, res, next) => {
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

    // need this below the if statement on 413 because the functions below depend on
    // ownerID to exist
    const ownerId = spot.ownerId

    if(userId !== ownerId) {
        const bookings = await Booking.findAll({
            where: {
                spotId
            },
            attributes: ['spotId', 'startDate', 'endDate']
        })

        res.json(bookings)
    }

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

    if (!spot) {
        res.status(404)
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    // Spot must NOT belong to the current user
    // If the userId matches ownerID and spotId
    // if (userId === spot.ownerId) {
    //     res.status(403)
    //     res.json({
    //         "message": "Forbidden",
    //         "statusCode": 403
    //     })
    // }

    let endDateParsed = new Date(endDate)
    let startDateParsed = new Date(startDate)

    if (endDateParsed <= startDateParsed) {
        res.status(404)
        res.json({
            "message": "Validation error",
            "statusCode": 400,
            "errors": {
              "endDate": "endDate cannot be on or before startDate"
            }
        })
    }
    console.log(spotId)
    console.log(userId)
    // find all the bookings
    let existingBookings = await Booking.findAll({
        where: {
            spotId
        },
        raw:true
    })

    // if there are no bookings at the spot
    if (existingBookings.length === 0) {
        const newBooking = await Booking.create({
            spotId,
            userId,
            startDate,
            endDate
        })

        res.json(newBooking)
    } else {
        // loop through the bookings, if start date greater than exist start
        // && end date is less than exist end throw error
        for (let bookings of existingBookings) {
            let existStartDate = Date.parse(bookings.startDate)
            let existEndDate = Date.parse(bookings.endDate)
            if (startDateParsed >= existStartDate && startDateParsed <= existEndDate) {
                res.status(403)
                res.json({
                    "message": "Sorry, this spot is already booked for the specified dates",
                    "statusCode": 403,
                    "errors": {
                        "startDate": "Start date conflicts with an existing booking",
                        "endDate": "End date conflicts with an existing booking"
                    }
                })
            }
        }
    }
});

// Delete a Spot
router.delete('/:spotId', requireAuth, async(req, res, next) => {
    const userId = req.user.id;
    const spotId = req.params.spotId;

    // check to see if spot to be delete exists
    const spot = await Spot.findByPk(spotId)

    // if spot exists and the user is the owner of the spot
    if (spot && userId === spot.ownerId) {
        await spot.destroy()
        res.json({
            "message": "Successfully deleted",
            "statusCode": 200
        })
    } else {
        res.status(404)
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
})

module.exports = router;

/*
--------------------CODE THAT WOULD WORK WITH SQLITE3 BUT NOT POSTGRESSQL-------------
let spots = await Spot.findAll({
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
                attributes: ['url'], // eager loaded url here
                where: {
                    preview: true
                }
            },
        ],
        group: ['Spot.id'],
        raw: true
    })

    spots.map(spot => {
        // creating previewImage setting the value to the url (renaming)
        spot.previewImage = spot["SpotImages.url"]
        // delete the old key-value that is the same
        delete spot["SpotImages.url"]
        return spot
    })

    */
