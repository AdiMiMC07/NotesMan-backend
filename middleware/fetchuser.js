const jwToken = require("jsonwebtoken");
const jwt_secret = "include<iostream>";

const fetchuser = (req,res,next)=>{
    try{
        const token = req.header('auth-token');
        if (!token){
            res.status(401).send("Please enter a token");
        } 
        const data = jwToken.verify(token,jwt_secret);
        req.user = data.user;
        next();
    }
    catch(err){
        res.status(401).send("Please enter a valid token");
    }
}

module.exports = fetchuser;