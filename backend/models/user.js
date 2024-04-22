const mongoose = require('mongoose'); //importing package from mongoose

const { Schema } = mongoose;

const userScehma = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true } //time automatically records inside mongodb
);

module.exports = mongoose.model('User', userScehma, 'users'); // User is model name and userschema will record inside users collection
