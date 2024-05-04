const express = require('express'); //importing express
const authController = require('../controller/authController'); //importing autrorized controller from controller
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
//CRUD
//create
//read all blogs
//read blog by id
//update
//delete

//comment
//create comment
//read comments by blog id

module.exports = router;
