const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        minlength:5,
    },
    date: {
        type:Date,
        default:Date.now,
    }
});

module.exports = mongoose.model('users', UsersSchema);