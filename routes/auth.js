const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../model/User');
const bcryptjs = require('bcryptjs');
const jwToken = require('jsonwebtoken');
require('dotenv').config({path:'../notesman-backend/.env'});
const fetchuser = require('../middleware/fetchuser');
const jwt_secret = process.env.JWT_SECRET;

// Route 1 : Creating create user endpoint :POST /api/auth/createuser : no login req
router.post('/createuser', [body('name').isLength({ min: 1, max: 50 }), body('email').isEmail()], async (req, res) => {
  try {
    // checking the req body data
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success:success,errors: errors.array() });
    }
    // finding a user with same email address
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ success:success,err: "Sorry this user already exists" });
    }
    // creating user
    let salt = await bcryptjs.genSalt(10);
    let securedPass = await bcryptjs.hash(req.body.password, salt);
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: securedPass
    });
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwToken.sign(data, jwt_secret);
    res.json({success:true,authtoken});
  }
  catch (error) {
    console.error(error.message, "Something went wrong");
  }
})
// Route 2 : Creating login endpoint : POST /api/auth/login : no login req
router.post('/login', [body('email').isEmail(), body('password', 'Please enter the password').exists()], async (req, res) => {
  let success = false;
  try {
    // checking the validity of data provided by user
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    // finding user in the database and checking the credentials
    let { email, password } = req.body;
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ success,err: "Invalid Login Credentials" });
    }
    let passwordCompare = await bcryptjs.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ err: "Invalid Login Credentials" });
    }
    
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwToken.sign(data, jwt_secret);
    res.json({success:true,authtoken:authtoken});
  }
  catch (error) {
    console.error(error.message, "Something went wrong");
  }
});
// Route 3 :Get user details : /api/auth/getuser : Login req
router.get('/getuser',fetchuser,async (req,res)=>{
  try {
    let userid = req.user.id;
    const user = await User.findById(userid).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message, "Something went wrong");
  }
})
module.exports = router