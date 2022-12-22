const mongoose = require('mongoose');
const {Schema} = mongoose;
const NotesSchema = new Schema({
    name:{
        type : String,
        required : true
    },
    description:{
        type : String,
        required : true
    },
    tags:{
        type : String,
        default : "general"
    },
    date:{
        type : Date,
        default : Date.now
    }
});
module.exports = mongoose.model('notes',NotesSchema)