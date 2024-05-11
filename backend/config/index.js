const dotev = require('dotenv').config(); //importing dotenev package and calling config method

const PORT = process.env.PORT; //port from env file
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING; // URL from env file
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET; //access_token_key from env
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET; //refresh_token_key from env
const BACKEND_SERVER_PATH = process.env.BACKEND_SERVER_PATH;

module.exports = {
  PORT,
  MONGODB_CONNECTION_STRING,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  BACKEND_SERVER_PATH,
};
