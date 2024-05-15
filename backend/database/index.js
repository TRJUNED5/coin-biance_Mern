const mongoose = require('mongoose'); //importing mongoose

const { MONGODB_CONNECTION_STRING } = require('../config/index'); // importing mongo URL from config/index

const dbConnect = async () => {
  //connecting database
  try {
    mongoose.set('strictQuery', false); //just a warning
    const conn = await mongoose.connect(MONGODB_CONNECTION_STRING);
    console.log(`Database connected to host: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

module.exports = dbConnect; //exporting the fucntion
