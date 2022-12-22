const mongoose = require('mongoose');
const mongooseURI = "mongodb://localhost:27017/notesman";

const connectToMongo = ()=>{
    mongoose.connect(mongooseURI,()=>{
        console.log("Connected to mongo");
    })
}
mongoose.set('strictQuery', true);
module.exports = connectToMongo;