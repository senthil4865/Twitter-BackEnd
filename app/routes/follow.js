const express = require('express');
const followController = require("../controllers/followController");
const appConfig = require("../../config/appConfig")
const auth = require('../middlewares/auth')

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/following`;


    app.post(`${baseUrl}/send/follow/request`, auth.isAuthorized,followController.sendFollowRequest);
    /**
        * @apiGroup friends
        * @apiVersion  1.0.0
        * @api {get} /api/v1/friends/send/friend/request api for Sending Friend Request.
        *
        * @apiParam {string} authToken authToken of the user. (query/body/header params) (required)
        * @apiParam {string} senderId Id of the Sender. (body params) (required)
        * @apiParam {string} senderName Name of the Sender. (body params) (required)
        * @apiParam {string} receiverId Id of the Receiver. (body params) (required)
        * @apiParam {string} receiverName Name of the Receiver. (body params) (required)
        * @apiSuccess {object} myResponse shows error status, message, http status code, result.
        * 
        * @apiSuccessExample {object} Success-Response:
           {
               "error": false,
               "message": "Friend Request Sent",
               "status": 200,
               "data": null
           }
       */


      app.post(`${baseUrl}/unfollow/user`, auth.isAuthorized,followController.unfollowFunction);
      /**
      * @apiGroup friends
      * @apiVersion  1.0.0
      * @api {get} /api/v1/friends/unfriend/user api to Unfriend user.
      *
      * @apiParam {string} authToken authToken of the user. (query/body/header params) (required)
      * @apiParam {string} senderId Id of the Sender. (body params) (required)
      * @apiParam {string} senderName Name of the Sender. (body params) (required)
      * @apiParam {string} receiverId Id of the Receiver(Login User). (body params) (required)
      * @apiParam {string} receiverName Name of the Receiver(Login User). (body params) (required)
      * @apiSuccess {object} myResponse shows error status, message, http status code, result.
      * 
      * @apiSuccessExample {object} Success-Response:
         {
             "error": false,
             "message": "Canceled Friend Request",
             "status": 200,
             "data": null
         }
     */

    app.get(`${baseUrl}/view/follow/received/:userId`, auth.isAuthorized, followController.getAllFollowers);
    /**
        * @apiGroup friends
        * @apiVersion  1.0.0
        * @api {get} /api/v1/friends/view/friend/request/received/:userId api for Getting all friends request Received.
        *
        * @apiParam {string} authToken authToken of the user. (query/body/header params) (required)
        * @apiParam {string} UserId Id of the user. (header params) (required)
        * 
        * @apiSuccess {object} myResponse shows error status, message, http status code, result.
        * 
        * @apiSuccessExample {object} Success-Response:
        {
            "error": false,
            "message": "All Received Requsts Found",
            "status": 200,
            "data": [
                {
                    "_id": "5e0e4088ed21f207087k6210f3",
                    "friendRequestReceived": [
                        {
                            "friendId": "SJ70bQL97",
                            "friendName": "kumar senthil",
                            "_id": "5e10351040fb6950fsw362f"
                        }
                    ]
                }
            ]
        }
    */





}


