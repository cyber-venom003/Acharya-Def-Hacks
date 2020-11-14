const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required:true
    },
    role: {
        type: String,
        required:true
    },
    number:{
        type:String,
        required:true
    },
    desc: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        default: Date.now
    }
})
module.exports = Users = mongoose.model("Users",UserSchema);