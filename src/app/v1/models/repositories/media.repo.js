"use strict";

//* REQUIRE
const { InternalServerError } = require("../../../../cores/error.response");
const awsBucket = require("../../../../dbs/init.minio");

class MediaRepository {
  async putObject(params) {
    try {
      return await awsBucket.putObject(params).promise();
    } catch (_) {
      throw new InternalServerError();
    }
  }

  async getSignedUrlPromise(urlParams) {
    try {
      return await awsBucket.getSignedUrlPromise("getObject", urlParams);
    } catch (_) {
      throw new InternalServerError();
    }
  }
}
module.exports = new MediaRepository();
