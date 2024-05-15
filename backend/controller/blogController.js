const Joi = require('joi');
const fs = require('fs');
const Blog = require('../models/blog');
const { BACKEND_SERVER_PATH } = require('../config/index');
const BlogDTO = require('../dto/blog');
const BlogDetailsDTO = require('../dto/blog-details');
const Comment = require('../models/comment');

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/; //string pattern to match mongodb pattern

const blogController = {
  async create(req, res, next) {
    // 1.validate req body
    // 2.handle photo storage, naming
    // 3.add to db
    // 4.return response

    // photo will be client side -> base64 encoded string -> decode -> store -> save photo's path in db

    const createBlogSchema = Joi.object({
      title: Joi.string().required(),
      author: Joi.string().regex(mongodbIdPattern).required(), //regex or regular expression is used for matching or finding and it is using for matching mongodbid
      content: Joi.string().required(),
      photo: Joi.string().required(),
    });

    const { error } = createBlogSchema.validate(req.body); //for validation

    if (error) {
      return next(error);
    }

    const { title, author, content, photo } = req.body;

    // photo read as buffer
    const buffer = Buffer.from(
      photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''),
      'base64'
    );
    //allot a random name
    const imagePath = `${Date.now()}-${author}.png`;

    // save locally
    try {
      fs.writeFileSync(`storage/${imagePath}`, buffer);
    } catch (error) {
      return next(error);
    }

    //save blog in db
    let newBlog;
    try {
      newBlog = new Blog({
        title,
        author,
        content,
        photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`,
      });

      await newBlog.save();
    } catch (error) {
      return next(error);
    }

    const blogDto = new BlogDTO(newBlog);

    return res.status(201).json({ blog: blogDto });
  },
  async getAll(req, res, next) {
    try {
      const blogs = await Blog.find({}); //fetching all data from db

      const blogsDto = []; //data in dto form which all datas we want to show

      for (let i = 0; i < blogs.length; i++) {
        const dto = new BlogDTO(blogs[i]);
        blogsDto.push(dto);
      }

      return res.status(200).json({ blogs: blogsDto });
    } catch (error) {
      return next(error);
    }
  },
  async getById(req, res, next) {
    // validate id
    // response

    const getByIdSchema = Joi.object({
      id: Joi.string().regex(mongodbIdPattern).required(), //regex is used for matching,finding and replacing. here regex is macthing mongodbIdpattern or user id(validate)
    });

    const { error } = getByIdSchema.validate(req.params); //we are sending data to the request parameters

    if (error) {
      return next(error);
    }

    let blog;

    const { id } = req.params;

    try {
      blog = await Blog.findOne({ _id: id }).populate('author');
    } catch (error) {
      return next(error);
    }

    const blogDto = new BlogDetailsDTO(blog); //for single details in dto form which info we want to show

    return res.status(200).json({ blog: blogDto });
  },
  async update(req, res, next) {
    // validate
    //

    const updateBlogSchema = Joi.object({
      title: Joi.string().required(),
      content: Joi.string().required(),
      author: Joi.string().regex(mongodbIdPattern).required(), // it will match with mongodb info
      blogId: Joi.string().regex(mongodbIdPattern).required(),
      photo: Joi.string(),
    });

    const { error } = updateBlogSchema.validate(req.body);

    const { title, content, author, blogId, photo } = req.body;

    //delete previous photo
    //save new photo

    let blog;

    try {
      blog = await Blog.findOne({ _id: blogId });
    } catch (error) {
      return next(error);
    }

    if (photo) {
      let previousPhoto = blog.photoPath;

      previousPhoto = previousPhoto.split('/').at(-1); // 123124-324234.png photo name chane

      // delete photo
      fs.unlinkSync(`storage/${previousPhoto}`);

      // photo read as buffer
      const buffer = Buffer.from(
        photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''),
        'base64'
      );
      //allot a random name
      const imagePath = `${Date.now()}-${author}.png`;

      // save locally
      try {
        fs.writeFileSync(`storage/${imagePath}`, buffer);
      } catch (error) {
        return next(error);
      }

      await Blog.updateOne(
        { _id: blogId },
        {
          title,
          content,
          photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`,
        }
      );
    } else {
      //if we don't want to update photo. just content and title
      await Blog.updateOne({ _id: blogId }, { title, content });
    }

    return res.status(200).json({ message: 'blog updated' });
  },
  async delete(req, res, next) {
    // validate id
    // delete blog
    // delete comments on this blog

    const deleteBlogSchema = Joi.object({
      id: Joi.string().regex(mongodbIdPattern).required(),
    });

    const { error } = deleteBlogSchema.validate(req.params);

    const { id } = req.params;

    //delete blog
    //delete comments
    try {
      await Blog.deleteOne({ _id: id });

      await Comment.deleteMany({ blog: id });
    } catch (error) {
      return next(error);
    }

    return res.status(200).json({ message: 'blog deleted' });
  },
};

module.exports = blogController;
