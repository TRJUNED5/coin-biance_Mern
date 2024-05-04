const JWTService = require('../services/JWTService');
const User = require('../models/user');
const userDto = require('../dto/user');
const UserDTO = require('../dto/user');

const auth = async (req, res, next) => {
  try {
    //1. refresh access token validation
    const { refreshToken, accessToken } = req.cookies;

    if (!refreshToken || !accessToken) {
      //if both of them are null
      const error = {
        status: 401,
        message: 'Unauthorized',
      };

      return next(error);
    }

    let _id;
    try {
      _id = JWTService.veifyAccessToken(accessToken); //verifying accessToken and payload is _id
    } catch (error) {
      return next(error);
    }

    let user;

    try {
      user = await User.findOne({ _id: _id }); //finding id
    } catch (error) {
      return next(error);
    }

    const userDto = new UserDTO(user);

    req.user = userDto; // userDto will show in the terminal and cookies also

    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = auth;
