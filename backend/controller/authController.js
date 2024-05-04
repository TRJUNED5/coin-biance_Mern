const Joi = require('joi'); //imporing Joi from joi but Joi need to be in capital J but inside require joi will be small letter
const User = require('../models/user');
const bcrypt = require('bcryptjs'); //importing bcryptjs for hashing password
const UserDTO = require('../dto/user');
const JWTService = require('../services/JWTService'); //imporing tokens from JWTServices
const RefreshToken = require('../models/token');

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/; //password need to be minimum 8 and maximum 25 characters

const authController = {
  async register(req, res, next) {
    //1.validate user input
    const userRegisterSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(), // username characters must be minimum 5 and maximun 30
      name: Joi.string().max(30).required(), // username characters must be minimum 5 and maximun 30
      email: Joi.string().email().required(), //email are verifying from user model
      password: Joi.string().pattern(passwordPattern).required(), //password will come from user and need to match
      confirmPassword: Joi.ref('password'), //it will make sure if password and confirm password are same
    });

    const { error } = userRegisterSchema.validate(req.body); //it will validate datas from user in the body is it correct or not

    //2.if error in validation -> return error via middleware
    if (error) {
      return next(error);
    }
    //3.if email or username is already registered -> return an error
    const { username, name, email, password } = req.body;

    try {
      const emailInUse = await User.exists({ email }); //matching database users email from user collection

      const usernameInUse = await User.exists({ username }); //matching database users username from user collection

      if (emailInUse) {
        const error = {
          status: 409,
          message: 'Email already registered, use another email!',
        };

        return next(error);
      }

      if (usernameInUse) {
        const error = {
          status: 409,
          message: 'Username not available, choose another username!',
        };

        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    //4.password hash
    const hashedPassword = await bcrypt.hash(password, 10); //hashing password & 10 is for security power

    //123abc -> abadadadaadadad@ada1
    //login -> 123abcd ->

    //5.store user data in db
    let accessToken;
    let refreshToken;

    let user;

    try {
      const userToRegister = new User({
        username,
        email,
        name,
        password: hashedPassword,
      });

      user = await userToRegister.save(); //pushing to database

      // token generation
      accessToken = JWTService.signAccessToken({ _id: user._id }, '30m'); //30m is expiry time of jwt

      refreshToken = JWTService.signRefreshToken({ _id: user._id }, '60m');
    } catch (error) {
      return next(error);
    }

    // store refresh token in db
    await JWTService.storeRefreshToken(refreshToken, user._id);

    //send tokens in cookie
    res.cookie('accessToken', accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    }); //sending tokens to the cookie & maxAge means cookie expiry time & httpOnly is for security

    res.cookie('refreshToken', refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    //6.response send

    const userDto = new UserDTO(user);

    return res.status(201).json({ user: userDto, auth: true }); //testing
  },
  async login(req, res, next) {
    //1.validate user input
    //2.if validation error, return error
    //3. match username and password if there is no error
    //4.return response

    //we expect input data to be in such shape
    const userLoginSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(), //registered username must be same
      password: Joi.string().pattern(passwordPattern), //registered password must be same
    });

    const { error } = userLoginSchema.validate(req.body); //it will validate datas from user who registered

    //if error in validation
    if (error) {
      return next(error);
    }

    //destructering
    const { username, password } = req.body;

    //const username = req.body.username;
    //const password = req.body.password;

    //if there is no error then we will match username and password from the database
    let user;

    try {
      // match username
      user = await User.findOne({ username: username });

      //if user does not match
      if (!user) {
        const error = {
          status: 401,
          message: 'Invalid username',
        };

        return next(error);
      }

      // match password (password saved in mongodb is in hash form)
      // req.body.password -> hash -> match (password variable from user will turn it into hash then match )

      const match = await bcrypt.compare(password, user.password); //user input password matching with database(user) password

      //if password does not match
      if (!match) {
        const error = {
          status: 401,
          message: 'Invalid password',
        };

        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    const accessToken = JWTService.signAccessToken({ _id: user._id }, '30m');
    const refreshToken = JWTService.signRefreshToken({ _id: user._id }, '60m');

    //update refresh token in database
    try {
      await RefreshToken.updateOne(
        {
          _id: user._id,
        },
        { token: refreshToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }

    res.cookie('accessToken', accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie('refreshToken', refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    const userDto = new UserDTO(user); //dto object

    return res.status(200).json({ user: userDto, auth: true }); //user succesfully matched
  },

  //logout controller
  async logout(req, res, next) {
    console.log(req);
    // 1. delete refresh token from db
    const { refreshToken } = req.cookies;

    try {
      await RefreshToken.deleteOne({ token: refreshToken });
    } catch (error) {
      return next(error);
    }

    //delete cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    //2. response
    res.status(200).json({ user: null, auth: false });
  },
  async refresh(req, res, next) {
    // 1. get refreshToken from cookies
    // 2. verify refreshToken
    // 3. generate new tokens
    // 4. update db, return response

    const originalRefreshToken = req.cookies.refreshToken;

    let id;

    try {
      id = JWTService.verifyRefreshToken(originalRefreshToken)._id;
    } catch (e) {
      const error = {
        status: 401,
        message: 'Unauthorized',
      };

      return next(error);
    }

    try {
      const match = RefreshToken.findOne({
        _id: id,
        token: originalRefreshToken,
      });

      if (!match) {
        const error = {
          status: 401,
          message: 'Unauthorized',
        };

        return next(error);
      }
    } catch (e) {
      return next(e);
    }
    try {
      const accessToken = JWTService.signAccessToken({ _id: id }, '30m');

      const refreshToken = JWTService.signRefreshToken({ _id: id }, '60m');

      await RefreshToken.updateOne({ _id: id }, { token: refreshToken });

      res.cookie('accessToken', accessToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });

      res.cookie('refreshToken', refreshToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });
    } catch (e) {
      return next(e);
    }

    const user = await User.findOne({ _id: id });

    const userDto = new UserDTO(user);

    return res.status(200).json({ user: userDto, auth: true });
  },
};

module.exports = authController; //export
