const express = require('express'); //importing express
const dbConnect = require('./database/index'); //importing from database index.js
const { PORT } = require('./config/index'); //importing port from config index
const router = require('./routes/index'); //importing api from routes
const errorHandler = require('./middleware/errorHandler');

const app = express(); //making a object

app.use(express.json()); //application to communicate data with json

app.use(router); //using router function

//const PORT = 5000

dbConnect(); //connecting to database

//app.get('/', (req, res) => res.json({ msg: 'Hello world123!' })); //browser API & response

app.use(errorHandler); //need to put it in the end to run it sequincially

app.listen(PORT, console.log(`Backend is running on port: ${PORT}`)); // app monitoring this port & callback
