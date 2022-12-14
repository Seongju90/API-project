const express = require('express')

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors
];

// Returns the information about the current user that is logged in.
router.get(
  '/',
  restoreUser,
  (req, res) => {
    const { user } = req;
    if (user) {
      user.toSafeObject()
      const { id, firstName, lastName, email, username } = user
      return res.json({
        id,
        firstName,
        lastName,
        email,
        username
      });
    } else {
      // if there is no user logged in do nothing, if you throw error here it will break
      res.json(null)
    }
  }
);

// Logs in a current user with valid credentials and returns the current user's information.
router.post(
    '/',
    validateLogin,
    async (req, res, next) => {
      const { credential, password } = req.body;

      const user = await User.login({ credential, password });

      if (!user) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = ['The provided credentials were invalid.'];
        return next(err);
      }

      let token = await setTokenCookie(res, user);

      // manipulating the data here broke my front end thunk action creator for login
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
      // res.json({user})
  }
);

router.delete(
  '/',
  (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
  }
);


module.exports = router;
