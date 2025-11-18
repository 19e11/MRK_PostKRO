const mongoose = require('mongoose');

const postSchema =new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
    },
    date:{
        type:Date,
        default:Date.now(),
    },
    content:{
        type:String,
    },  
    likes:[{
        type:mongoose.Schema.Types.ObjectId, ref:'user'
    }],
});

const postModel = mongoose.model('Post', postSchema);
module.exports = postModel;
