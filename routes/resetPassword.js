
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi= require('joi');
const {User, validate} = require('../models/user');


router.post("/resetPassword", async (req, res)=>{

  let erroData= {
    message: "Invalid email"
  }
  let userList = await User.find();
  //console.log(userList);

    let user = userList.find(x=> x.email == req.body.email);
    console.log(user);
    if(!user) return res.status(400).send(erroData);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(user).status(200);

})
module.exports = router;