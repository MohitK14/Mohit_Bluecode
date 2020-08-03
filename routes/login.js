
const bcrypt = require('bcrypt');
const Joi= require('joi');
const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/login', async (req, res) => {

  let erroData= {
    message: "Invalid email or password"
  }

  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

   let user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send(erroData);

   const validatePassword = await bcrypt.compare( req.body.password ,user.password);
   if(!validatePassword) return res.status(400).send(erroData);

   const token = user.generateAuthToken();

   let data ={
           
       email: user.email,
       id: user._id,
       tokenData: token
   }
     res.send(data).status(200);
   
});

function validate(req) {
    const schema = Joi.object({
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(req);
  }
  

module.exports = router;