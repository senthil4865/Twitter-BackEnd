const mongoose = require("mongoose");
const response = require("./../libs/responseLib");
const logger = require("./../libs/loggerLib");
const validateInput = require("../libs/paramsValidationLib");
const check = require("../libs/checkLib");
const Notify = require("../models/Notify");
const time = require("./../libs/timeLib");
const shortid = require('shortid');

// getting Notification by user id
let getNotifyById = (req, res) => {
  Notify.find({ receiverId: req.params.userId })
    .select("-__v -_id")
    .sort({ $natural: -1 })
    .lean()
    .exec((err, result) => {
      if (err) {
        console.log(err);
        logger.error(err.message, "NotifyController: getSingleNotify", 10);
        let apiResponse = response.generate(
          true,
          "Failed To Find Notify Details",
          500,
          null
        );
        res.send(apiResponse);
      } else if (check.isEmpty(result)) {
        logger.info("No Notify Found", "NotifyController:getSingleNotify");
        let apiResponse = response.generate(true, "No Notify Found", 404, null);
        res.send(apiResponse);
      } else {
        let apiResponse = response.generate(
          false,
          "Notify Details Found",
          200,
          result
        );
        res.send(apiResponse);
      }
    });
};

let saveNotification = (req, res) => {
  let validateTodoInput = () => {
    return new Promise((resolve, reject) => {
      if (
        req.body.senderName &&
        req.body.senderId &&
        req.body.receiverName &&
        req.body.receiverId
      ) {
        resolve(req);
      } else {
        logger.error(
          "Field Missing During Notification creation",
          "notifyController:saveNotification()",
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

  let saveNotification = () => {
    return new Promise((resolve, reject) => {
      let newNotify = new Notify({
        notifyId: shortid.generate(),
        senderName: req.body.senderName,
        senderId: req.body.senderId,
        receiverName: req.body.receiverName,
        receiverId: req.body.receiverId,
        redirectId: req.body.redirectId || "",
        message: req.body.message || "",
        createdOn: time.now()
      });

      newNotify.save((err, result) => {
        if (err) {
            console.log(err);
            logger.error(err.message, "NotifyController:saveNotification", 10);
            let apiResponse = response.generate(
              true,
              "Failed to add new Notification",
              500,
              null
            );
            reject(apiResponse);
          } else {
            let newresult = result.toObject();
            resolve(newresult);
          }
      });
    });
  };

  validateTodoInput(req, res)
    .then(saveNotification)
    .then(resolve => {
      let apiResponse = response.generate(
        false,
        "Notification saved",
        200,
        resolve
      );
      res.send(apiResponse);
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
};

module.exports = {
  getNotifyById: getNotifyById,
  saveNotification: saveNotification
};
