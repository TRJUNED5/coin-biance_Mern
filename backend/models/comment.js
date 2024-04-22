const mongoose = require('mongoose'); //importing package from mongoose

const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    blog: { type: mongoose.SchemaTypes.ObjectId, ref: 'blogs' }, // it will refer blog type connection or blog type document
    author: { type: mongoose.SchemaTypes.ObjectId, ref: 'users' }, //it will refer from user type documents
  },
  { timestamps: true } //time automatically records inside mongodb
);

module.exports = mongoose.model('Comment', commentSchema, 'comments'); // Comment is a model name and commentschema will record inside comments collection
