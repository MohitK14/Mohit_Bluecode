const bcrypt = require('bcrypt');
// const _ = require('loadash');
const jwt = require('jsonwebtoken');
const config = require('config');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/signup', async (req, res) => {

   let erroData= {
      message: "User is already registered"
    }

  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

   let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(400).send(errorData);

    user = new User({
       email: req.body.email,
       password: req.body.password
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

   await user.save();

   const token = user.generateAuthToken();
   res.header('x-auth-token', token).send(user).status(200);
  
});

module.exports = router;