const shortid = require("shortid");
const time = require("../libs/timeLib");
const response = require("../libs/responseLib");
const logger = require("../libs/loggerLib");
const check = require("../libs/checkLib");
const User = require("../models/User");
const Tweet = require("../models/Tweet");


let addTweetFunction = (req, res) => {
  let validateTodoInput = () => {
    return new Promise((resolve, reject) => {
      if (
        req.body.tweetDescription &&
        req.body.hashTags &&
        req.body.tweetCreatorId &&
        req.body.tweetCreatorName
      ) {
        resolve(req);
      } else {
        logger.error(
          "Field Missing During Tweet Creation",
          "TweetController: addTweetFunction()",
          5
        );
        let apiResponse = response.generate(
          true,
          "One or More Parameter(s) is missing",
          400,
          null
        );
        reject(apiResponse);
      }
    });
  }; 


  let addTweet = () => {
    return new Promise((resolve, reject) => {
      
      let newTweet = new Tweet({
        tweetId: shortid.generate(),
        tweetDescription: req.body.tweetDescription,
        tweetHashTags: req.body.hashTags,
        tweetCreatorId: req.body.tweetCreatorId,
        tweetCreatorName:req.body.tweetCreatorName,
  
    })

    newTweet.save((err, newTweet) => {
      if (err) {
          console.log(err)
          logger.error(err.message, 'TweetController: createTweet', 10)
          let apiResponse = response.generate(true, 'Failed to create new Tweet', 500, null)
          res.send(apiResponse)
      } else {
          let newTweetObj = newTweet.toObject();
          let apiResponse = response.generate(false, 'Tweet Created successfully', 200, newTweet)
          res.send(apiResponse)
      }
  })

    });
  }; 

  validateTodoInput(req, res)
    .then(addTweet)

    .then(resolve => {
  
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
};

let getAllTweetsFunction = (req, res) => {
  let userIds = req.params.id.split(',')
  let findItems = (req, res) => {
    return new Promise((resolve, reject) => {
      Tweet.find({ tweetCreatorId: { $in: userIds } }).count((err, result) => {
        if (err) {
          console.log(err);
          logger.error(err.message, "TweetController: getAllTweets", 10);
          let apiResponse = response.generate(
            true,
            "Failed To Find Tweet Details",
            500,
            null
          );
          res.send(apiResponse);
        } else if (check.isEmpty(result)) {
          logger.info("No Tweet Found", "TweetController: getAllTweets");
          let apiResponse = response.generate(true, "No Tweet Found", 404, null);
          res.send(apiResponse);
        } else {
          let count = result;
          let pageNumber = parseInt(req.query.pageIndex);
          let nPerPage = parseInt(req.query.pageSize);
          Tweet.find({ tweetCreatorId: { $in: userIds }  })
            .select()
            .skip(pageNumber > 0 ? pageNumber * nPerPage : 0)
            .limit(nPerPage)
            .lean()
            .exec((err, TweetDetails) => {
              if (err) {
                console.log(err);
                logger.error(err.message, "Tweet Controller: findTweet", 10);
                let apiResponse = response.generate(
                  true,
                  "Failed To Find Tweet Items",
                  500,
                  null
                );
                reject(apiResponse);
              } else if (check.isEmpty(TweetDetails)) {
                logger.info("No Tweet Found", "Tweet  Controller:findTweet");
                let apiResponse = response.generate(
                  true,
                  "No Tweet Found",
                  404,
                  null
                );
                reject(apiResponse);
              } else {
                let apiResponse = response.generate(
                  false,
                  "Tweets Found and Listed",
                  200,
                  TweetDetails
                );
                apiResponse.count = count;
                resolve(apiResponse);
              }
            });
        }
      });
    });
  };

  findItems(req, res)
    .then(resolve => {
      res.send(resolve);
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
};


module.exports = {
  addTweetFunction: addTweetFunction,
  getAllTweetsFunction: getAllTweetsFunction,
}; 



