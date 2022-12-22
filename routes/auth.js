const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../model/User');
const bcryptjs = require('bcryptjs');

router.post('/createuser', [body('name').isLength({ min: 1, max: 50 }), body('email').isEmail()], async (req, res) => {
    try{
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      let user = await User.findOne({email : req.body.email});
      if (user){
        return res.status(400).json({err : "Sorry this user already exists"});
      }
      let salt = await bcryptjs.genSalt(10);
      let securedPass = await bcryptjs.hash(req.body.password,salt);
      User.create({
        name: req.body.name,
        email: req.body.email,
        password : securedPass
      }).then(user => res.json(user))
      .catch(err=>{
        console.log(err);
      });
    } 
    catch(error){
      console.error(error.message,"Something went wrong");
    }
  })
  module.exports = router