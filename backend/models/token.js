const mongoose = require('mongoose'); //importing package from mongoose

const { Schema } = mongoose; //destructuring schema

const refreshTokenSchema = Schema(
  {
    //creating a model
    token: { type: String, required: true }, //storing token
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'users' }, //token initiated in users
  },
  { timestamps: true }
);

module.exports = mongoose.model('RefreshToken', refreshTokenSchema, 'tokens');
