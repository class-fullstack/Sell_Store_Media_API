//* LIB
const _ = require("lodash");

//* REQUIRE
const { getInfoHeaders } = require("../commons/helpers/headerHandler");
const {
  BadRequestRequestError,
  InternalServerError,
} = require("../cores/error.response");

class HeaderMiddleware {
  static getHeaders(req, __, next) {
    try {
      //* 1. Get header device
      const infoHeaders = getInfoHeaders(req.headers);
      const checkEmpty =
        _.isNull(infoHeaders) ||
        _.isEmpty(infoHeaders) ||
        _.isEmpty(infoHeaders.firebase_device_id) ||
        _.isNull(infoHeaders.firebase_device_id);
      if (checkEmpty) {
        return next(new BadRequestRequestError());
      }

      //* 2. If device exits add device in request
      if (infoHeaders) {
        req.infoHeaders = infoHeaders;
        return next();
      }
      //* 3. If device not found
      return next(new BadRequestRequestError());
    } catch (error) {
      return next(new InternalServerError());
    }
  }
}
module.exports = HeaderMiddleware;
