const dotev = require('dotenv').config(); //importing dotenev package and calling config method

const PORT = process.env.PORT; //port from env file
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING; // URL from env file

module.exports = {
  PORT,
  MONGODB_CONNECTION_STRING,
};
