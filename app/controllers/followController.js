const mongoose = require('mongoose');
const response = require('../libs/responseLib')
const logger = require('../libs/loggerLib');
const check = require('../libs/checkLib')
const User=require('../models/User');


let sendFollowRequest = (req, res) => {
    let validateUserInput = () => {
        return new Promise((resolve, reject) => {
            if (req.body.senderId && req.body.senderName && req.body.receiverId && req.body.receiverName) {
                    resolve(req)
            } else {
                logger.error('Field Missing During Sending request', 'followController: sendFollowRequest', 5)
                let apiResponse = response.generate(true, 'One or More Parameter(s) is missing', 400, null)
                reject(apiResponse)
            }
        })
    }

    let updateSender = () => {
        let subOptions = {
            followerId: req.body.receiverId,
            followerName: req.body.receiverName,
        }

        //I am following
        let options = {
            $push: { 
                following: { $each: [ subOptions ] } 
            } 
        }

        return new Promise((resolve, reject) => {
            User.updateOne({userId: req.body.senderId }, options).exec((err, result) => {
                if (err) {
                    logger.error(err.message, 'Follow Controller:sendFollowRequest-updateFollower', 10)
                    let apiResponse = response.generate(true, 'Failed To Update Follower', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('Sender not Found', 'Follow Controller: sendFollowRequest-updateFollower')
                    let apiResponse = response.generate(true, 'Follwer not Found', 404, null)
                    reject(apiResponse)
                } else {
                    let apiResponse = response.generate(false, 'Updated Me with the person i am following', 200, null)
                    resolve(apiResponse)

                }
            });
        })
    }

    let updateReceiver = () => {
        let subOptions = {
            followerId: req.body.senderId,
            followerName: req.body.senderName,
        }

        let options = {
            $push: { 
                followers: { $each: [ subOptions ]                     
                } 
            } 
        }

        return new Promise((resolve, reject) => {
            User.updateOne({userId: req.body.receiverId }, options).exec((err, result) => {
                if (err) {
                    logger.error(err.message, 'Follow Controller:sendFollowRequest-updateReceiver', 10)
                    let apiResponse = response.generate(true, 'Failed To Update receiver', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('receiver not Found', 'Friend Controller: sendFollowRequest-updateReceiver')
                    let apiResponse = response.generate(true, 'Receiver not Found', 404, null)
                    reject(apiResponse)
                } else {
                    resolve(result)
                }
            });
        })
    } 

    validateUserInput(req, res)
        .then(updateSender)
        .then(updateReceiver)
        .then((resolve) => {            
            let apiResponse = response.generate(false, 'Follow request success', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.status(err.status)
            res.send(err)
        })
}


let getAllFollowers = (req, res) => {
    User.find({userId:req.params.userId})
        .select('followers')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Friend Controller: getAllRequestReceived', 10)
                let apiResponse = response.generate(true, 'Failed To Find Received Requests', 500, null)
                res.send(apiResponse)
            } else
             {
                let apiResponse = response.generate(false, 'All Received Requests Found', 200, result)
                res.send(apiResponse)
            }
        })
}

let unfollowFunction = (req, res) => {
    let validateUserInput = () => {
        return new Promise((resolve, reject) => {
            if (req.body.senderId && req.body.senderName && req.body.receiverId && req.body.receiverName) {
                    resolve(req)
            } else {
                logger.error('Field Missing During Accepting request', 'friendController: unfriendFunction', 5)
                let apiResponse = response.generate(true, 'One or More Parameter(s) is missing', 400, null)
                reject(apiResponse)
            }
        })
    }

    let updateSenderFollowingList = () => {
        
        let options = {
            $pull: { 
                following : 
                 {  followerId: req.body.receiverId,
                    followerName: req.body.receiverName 
                } 
            } 
        }

        return new Promise((resolve, reject) => {
            User.update({userId: req.body.senderId }, options).exec((err, result) => {
                if (err) {
                    logger.error(err.message, 'Friend Controller:unfriendFunction-updateSenderFriendList', 10)
                    let apiResponse = response.generate(true, 'Failed To Update Sender Friend List', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('Sender not Found', 'Friend Controller: unfriendFunction-updateSenderFriendList')
                    let apiResponse = response.generate(true, 'Sender not Found', 404, null)
                    reject(apiResponse)
                } else {
                    let apiResponse = response.generate(false, 'Updated Sender Friend List', 200, null)
                    resolve(apiResponse)
                }
            });
        })
    } 

    let updateReceiverFollowerList = () => {
        
        let options = {
            $pull: { 
                followers: {   followerId: req.body.senderId,
                    followerName: req.body.senderName } 
            } 
        }

        return new Promise((resolve, reject) => {
            User.update({userId: req.body.receiverId }, options).exec((err, result) => {
                if (err) {
                    //console.log("Error in verifying" + err)
                    logger.error(err.message, 'Friend Controller:unfriendFunction-updateReceiverFollowersList', 10)
                    let apiResponse = response.generate(true, 'Failed To Update Receiver Followers List', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('Reciver not Found', 'Follow Controller: unfollowFunction-updateReceiverFollowersList')
                    let apiResponse = response.generate(true, 'Receiver not Found', 404, null)
                    reject(apiResponse)
                } else {
                    let apiResponse = response.generate(false, 'Updated Receiver Followers List', 200, null)
                    resolve(apiResponse)
                }
            });
        })
    } 


    validateUserInput(req, res)
        .then(updateSenderFollowingList)
        .then(updateReceiverFollowerList)
        .then((resolve) => {            
            let apiResponse = response.generate(false, 'UnFollow user', 200, null)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.status(err.status)
            res.send(err)
        })
}



module.exports = {
   getAllFollowers:getAllFollowers,
   sendFollowRequest:sendFollowRequest,
   unfollowFunction:unfollowFunction
}