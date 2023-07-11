const mongoose = require('mongoose');
require('dotenv').config({path:__dirname+'/.env'});
const mongooseURI = process.env.MONGO_DB_STRING;
console.log(mongooseURI)
const connectToMongo = ()=>{
    mongoose.connect(mongooseURI,()=>{
        console.log("Connected to mongo");
    })
}
mongoose.set('strictQuery', true);
module.exports = connectToMongo;