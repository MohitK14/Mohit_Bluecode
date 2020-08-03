require('express-async-errors')
const config = require('config');
const Joi = require('joi');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const signup = require('./routes/signup');
const login = require('./routes/login');
const resetPassword = require('./routes/resetPassword');
const cors = require('cors');
const error = require('./middleware/error') 

app.use(cors());
app.use(express.json());
app.use('/api/users', signup);
app.use('/api/users', login);
app.use('/api/users', resetPassword)

app.use(error);

if(!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPrivateKey does not exist');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/users', { useUnifiedTopology: true, useCreateIndex: true, useNewUrlParser: true })
    .then(()=> console.log('Connected to mongodb'))
    .catch((err)=> console.error('Could not connect to mongo db', err));



const port = process.env.PORT || 3000
app.listen(3000, ()=> console.log("Listening on port "+port));