const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

/* -------------------------- VALIDATIONS --------------------------- */

const validateSignup = [
  // add attribute validations here because it checks this function when creating a VALID user.
  check('firstName')
    .exists({ checkFalsy: true})
    .isAlpha()
    .withMessage('Please provide a first name with alphabets and length of at least 4 characters'),
  check('lastName')
    .exists({ checkFalsy: true})
    .isAlpha()
    .withMessage('Please provide a last name with alphabets and length of at least 4 characters'),
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

/* --------------------------- ROUTERS -------------------------------*/

router.post(
    '/',
    validateSignup,
    async (req, res) => {
      // add the firstName lastName attributes here to make a post request of a signup
      const { firstName, lastName, email, password, username } = req.body;
      // it uses the static signup function in user.js on line 45 to create a user

      const existingEmail = await User.findOne({
        where: {
          email
        }
      })

      const existingUsername = await User.findOne({
        where: {
          username
        }
      })

      if (existingEmail) {
        res.status(403)
        res.json({
          "message": "User already exists",
          "statusCode": 403,
          "errors": {
            "email": "User with that email already exists"
          }
        })
      }

      if (existingUsername) {
        res.status(403)
        res.json({
            "message": "User already exists",
            "statusCode": 403,
            "errors": {
              "username": "User with that username already exists"
            }
        })
      }

      const user = await User.signup({ firstName, lastName, email, username, password });

      let token = await setTokenCookie(res, user);

      let userData = {}
      userData.id = user.id
      userData.firstName = user.firstName
      userData.lastName = user.lastName
      userData.email = user.email
      userData.username = user.username
      userData.token = token

      res.json({
        ...userData
      });
    }
  );

module.exports = router;
