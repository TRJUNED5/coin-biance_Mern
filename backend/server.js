const express = require('express'); //importing express
const dbConnect = require('./database/index'); //importing from database index.js
const { PORT } = require('./config/index'); //importing port from config index
const router = require('./routes/index'); //importing api from routes
const errorHandler = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser'); //importing cookieParser
const cors = require('cors');

const corsOptions = {
  credentials: true,
  origin: ['http://localhost:3000'],
};

const app = express(); //making a object

app.use(cookieParser()); //cookieparser middleware

app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' })); //application to communicate data with json & limit is for taking big picture from submit blog

app.use(router); //using router function

//const PORT = 5000

dbConnect(); //connecting to database

app.use('/storage', express.static('storage')); //storing static storage to access the image

//app.get('/', (req, res) => res.json({ msg: 'Hello world123!' })); //browser API & response

app.use(errorHandler); //need to put it in the end to run it sequincially

app.listen(PORT, console.log(`Backend is running on port: ${PORT}`)); // app monitoring this port & callback
