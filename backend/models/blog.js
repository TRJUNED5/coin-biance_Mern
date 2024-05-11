const mongoose = require('mongoose'); //importing pakage from mongoose

const { Schema } = mongoose; //or const Schema = mongoose.Schema; taking schema from mongoose

const blogScehma = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    photoPath: { type: String, required: true },
    author: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' }, //author ra refer krte parbe user der
  },
  { timestamps: true } //time automatically records inside mongodb
);

module.exports = mongoose.model('Blog', blogScehma, 'blogs'); // Blog is model name and blogschema will record inside blogs collection
