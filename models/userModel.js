const mongoose = require('mongoose');

const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    profilePic:{
        type:String,
        default:'https://ik.imagekit.io/19e11/PostKRO/Default.jpg?updatedAt=1764754831897',
    },
    post:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post' 
    }]
});

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;
