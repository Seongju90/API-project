// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const reviewsRouter = require('./reviews.js')
const bookingRouter = require('./bookings.js')
const spotImagesRouter = require('./spotimages.js')
const reviewImagesRouter = require('./reviewimage.js')

/* --------------------------- ROUTERS -------------------------------*/
const { restoreUser } = require('../../utils/auth.js');
// This will run the middleware before going to any RESTful endpoint
router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/spots', spotsRouter);
router.use('/reviews', reviewsRouter);
router.use('/bookings', bookingRouter);
router.use('/spot-images', spotImagesRouter);
router.use('/review-images', reviewImagesRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

// router.get(
    //   '/restore-user',
    //   (req, res) => {
        //     return res.json(req.user);
        //   }
        // );

        // const { setTokenCookie } = require('../../utils/auth.js');
        // const { User } = require('../../db/models');
        // router.get('/set-token-cookie', async (_req, res) => {
            //   const user = await User.findOne({
//       where: {
    //         username: 'Demo-lition'
    //       }
    //     });
    //   setTokenCookie(res, user);
    //   return res.json({ user });
    // });

    // // GET /api/require-auth
    // const { requireAuth } = require('../../utils/auth.js');
    // router.get(
        //   '/require-auth',
        //   requireAuth,
        //   (req, res) => {
            //     return res.json(req.user);
            //   }
            // );

module.exports = router;
