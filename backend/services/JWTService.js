const jwt = require('jsonwebtoken'); //importing jwttoken
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} = require('../config/index'); //importing access_token_key and refresh_token_key from index.js
const RefreshToken = require('../models/token'); //importing refreshtoken from token

class JWTService {
  //access token and refresh token's secret key must be different
  // sign access token
  static signAccessToken(payload, expiryTime) {
    //initiating methods & defining parameters
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: expiryTime }); //jwt tOken will return us
  }
  // sign refresh token
  static signRefreshToken(payload, expiryTime) {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: expiryTime });
  }
  // verify access token
  static veifyAccessToken(token) {
    return jwt.verify(token, ACCESS_TOKEN_SECRET); //VERIFY TOKEN
  }
  // verify refresh token
  static verifyRefreshToken(token) {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  }
  // store refresh token
  static async storeRefreshToken(token, userId) {
    try {
      const newToken = new RefreshToken({
        token: token,
        userId: userId,
      });

      // store in db
      await newToken.save();
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = JWTService;
