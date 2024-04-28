//* LIB
const _ = require("lodash");

//* REQUIRE
const UserTrackingModels = require("../app/v1/models/user_tracking.model");
const { ROLE_TYPE } = require("../commons/constants");
const {
  BadRequestRequestError,
  InternalServerError,
  UnauthorizedError,
} = require("../cores/error.response");

class UserTrackingMiddleware {
  static async checkTracking(req, __, next) {
    try {
      //* 1. Check info tracking params from headers
      const { device_id, firebase_device_id } = req.infoHeaders;
      const checkEmpty =
        _.isNull(device_id) ||
        _.isEmpty(device_id) ||
        _.isEmpty(firebase_device_id) ||
        _.isNull(firebase_device_id);
      if (checkEmpty) {
        return next(new BadRequestRequestError());
      }

      //* 2. Check device it have exits into database and check see is it device have block yet ?
      const resultInfoUserTracking = await UserTrackingModels.getUserTracking(
        {
          device_id,
          firebase_device_id,
          is_deleted: false,
          is_active: true,
          user_type: ROLE_TYPE.USER,
        },
        ["public_key"]
      );

      if (
        _.isEmpty(resultInfoUserTracking) ||
        _.isNull(resultInfoUserTracking)
      ) {
        return next(new UnauthorizedError());
      }

      //* 3. If ok all for user continue
      if (resultInfoUserTracking?.public_key) {
        req.publicKey = resultInfoUserTracking?.public_key;
        return next();
      }
      return next(new UnauthorizedError());
    } catch (error) {
      console.log(error);
      return next(new InternalServerError());
    }
  }
}
module.exports = UserTrackingMiddleware;
