const express = require('express');
const router = express.Router();
const tweetController = require("./../../app/controllers/tweetController");
const appConfig = require("../../config/appConfig");
const auth = require('../middlewares/auth');
const notifyController = require("../controllers/notifyController");


module.exports.setRouter=(app)=>{

     let baseUrl = `${appConfig.apiVersion}/tweet`;

       app.post(`${baseUrl}/addTweet`,tweetController.addTweetFunction);

        app.get(`${baseUrl}/:id/getAllTweets`, tweetController.getAllTweetsFunction);

   
}



