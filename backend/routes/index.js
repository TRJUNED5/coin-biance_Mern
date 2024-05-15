const express = require('express'); //importing express
const authController = require('../controller/authController'); //importing autrorized controller from controller
const blogController = require('../controller/blogController');
const commentController = require('../controller/commentController');
const auth = require('../middlewares/auth');

const router = express.Router(); // intializing object router from express

//testing
//router.get('/test', (req, res) => res.json({ msg: 'Working!' })); //browser API & response

// user

//register
router.post('/register', authController.register); //register api & any request from register will excecute authcontroller

//login
router.post('/login', authController.login); //login api & any request from login will excecute authcontroller

//logout
router.post('/logout', auth, authController.logout); //logout api and auth middleware

//refresh
router.get('/refresh', authController.refresh);

//blog

//create
router.post('/blog', auth, blogController.create); //endpoint and auth protected endpoint

//get all
router.get('/blog/all', auth, blogController.getAll);

//get blog by id
router.get('/blog/:id', auth, blogController.getById);

//update
router.put('/blog', auth, blogController.update);

//delete
router.delete('/blog/:id', auth, blogController.delete);

//CRUD
//create
//read all blogs
//read blog by id
//update
//delete

//comment
//create comment
router.post('/comment', auth, commentController.create);

//get
router.get('/comment/:id', auth, commentController.getById);

module.exports = router;
