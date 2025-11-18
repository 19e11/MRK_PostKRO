const mongoose = require('mongoose');

const connectDB = mongoose.connect('mongodb://127.0.0.1:27017/MrkBlogger');

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
        default:'../public/imgs/uploads/default.jpg',
    },
    post:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post' 
    }]
});

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;
