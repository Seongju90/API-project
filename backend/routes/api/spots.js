const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, sequelize } = require('../../db/models');
const { raw } = require('express');

const router = express.Router();

// GET ALL SPOTS
router.get('/', async(req, res, next) => {
    // EAGER LOADING
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
                attributes: ['url'],
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

    // let spotImg = await SpotImage.findAll({
    //     where: {
    //         preview: true
    //     },
    //     raw: true
    // })

    // nested for loop inefficient
    // spots.forEach(spot => {
    //     spotImg.forEach(img => {
    //         if (spot.id === img.spotId) {
    //             spot.previewImage = img.url
    //         }
    //     })
    // });

    res.json({Spots: spots})
});

// GET ALL SPOTS OWNED BY CURRENT USER
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
        ],
        group: ['Reviews.stars'],
        raw: true
    })

    let spotImg = await SpotImage.findOne({
        where: {
            spotId: userId
        }
    })

    // check after adding a spot image to the new spot
    // spots.forEach(spot => {
    //     if(spot.id === spotImg.spotId) {
    //         spot.previewImage = spotImg.url
    //     }
    // })

    res.json(spots)
})

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
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
})

router.post('/:spotId/images', requireAuth, async(req, res, next) => {
    const id = req.params.spotId;
    const { url, preview } = req.body;

    const spotExists = await Spot.findByPk(id)

    // if spot doesn't exists throw an error
    if (!spotExists) {
        res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
        // else create a new spotimage at that spot
    } else {
        const newSpotImg = await SpotImage.create({
            spotId: id,
            url,
            preview: true
        })

        let jsonSpotImg = newSpotImg.toJSON()
        // query for the new spot to edit format of the response
        let formatSpotImg = await SpotImage.findByPk(jsonSpotImg.id, {
            attributes: ['id', 'url', 'preview']
        })

        res.json(formatSpotImg)
    }
});








module.exports = router;
