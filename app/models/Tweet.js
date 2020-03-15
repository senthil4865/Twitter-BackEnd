const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const time = require('../libs/timeLib');

const TweetSchema=new Schema({
    tweetId:{type:String,default:''},
    tweetDescription:{type:String,default:''},
    tweetHashTags:{type:String,default:''},
    tweetCreatorId:{type:String,default:''},
    tweetCreatorName:{type:String,default:''},
},{
    usePushEach: true
  })

module.exports=mongoose.model('Tweet',TweetSchema);