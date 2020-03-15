const express = require('express');
const router = express.Router();
const tweetController = require("./../../app/controllers/tweetController");
const appConfig = require("./../../config/appConfig");
const auth = require('./../middlewares/auth');
const notifyController = require("./../controllers/notifyController");

module.exports.setRouter=(app)=>{

    let baseUrl = `${appConfig.apiVersion}/notification`;

      app.get(`${baseUrl}/:userId/notification`, auth.isAuthorized, notifyController.getNotifyById);
       /**
    * @apiGroup notification
    * @apiVersion  1.0.0
    * @api {get} /api/v1/notification/:userId/notification api for Getting all Notifications by Id.
    *
    * @apiParam {string} authToken authToken of the user. (query/body/header params) (required)
    * @apiParam {string} UserId Id of the user. (header params) (required)
    * 
    * @apiSuccess {object} myResponse shows error status, message, http status code, result.
    * 
    * @apiSuccessExample {object} Success-Response:
    {
        "error": false,
        "message": "Notify Details Found",
        "status": 200,
        "data": [
            {
              notifyId: "O5Q1F7GO"
              createdOn: "2020-01-04T03:33:19.000Z"
              seen: false
              message: "You have sent a friend Request to abc xyz"
              redirectId: "friend"
              receiverId: "wE0Ydy7x"
              receiverName: "senthil kumar"
              senderId: "poRnwhbu"
              senderName: "abc xyz"
            }
        ]
    }
   */
      app.post(`${baseUrl}/saveNotification`,auth.isAuthorized,notifyController.saveNotification);
        /**
     * @apiGroup notification
     * @apiVersion  1.0.0
     * @api {post} /api/v1/notification/saveNotification api to save Notification.
     *
     * @apiParam {string} authToken Authentication Token. (body/header/query params) (required)
     * @apiParam {string} senderName Name of the Notifcation sender. (body params) (required)
     * @apiParam {string} senderId   userId of the Notification sender. (body params) (required)
     * @apiParam {string} receiverName Name of the Notifcation Receiver. (body params) (required)
     * @apiParam {string} receiverId  userId of the Notification Receiver. (body params) (required)
     * @apiParam {string} redirectId  Id to redirect the user to respective Notification. (body params) 
     * @apiParam {string} message  mesage for the Notification. (body params) 
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
        { 
            "error": false,
            "message": "Notification Saved",
            "status": 200,
            "data": {
               __v: 0
               notifyId: "nS3tndP3"
               _id: "5e1045718064c13c2ce4bd7b"
               createdOn: "2020-01-04T07:57:37.000Z"
               seen: false
               message: "You have sent a friend Request to abc xyz"
               redirectId: "friend"
               receiverId: "wE0Ydy7x"
               receiverName: "senthil kumar"
               senderId: "poRnwhbu"
               senderName: "abc xyz"
            }
        }    
    */

}