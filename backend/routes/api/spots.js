const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, sequelize } = require('../../db/models');

const router = express.Router();

// GET ALL SPOTS
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
                // refactor this later repeating code here
                model: SpotImage,
                attributes: [],
                where: {
                    preview: true
                }
            },
        ],
        group: ['Reviews.stars'],
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
});

router.get('/current', requireAuth, async (req, res, next) => {
    // pulled from requireAuth -> restore User
    const userId = req.user.id

    let currentUserSpots = await Spot.findAll({
        where: {
            ownerId: userId
        }
    })

    res.json(currentUserSpots)
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













module.exports = router;
