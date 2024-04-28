"use strict";

//* REQUIRE
const { InternalServerError } = require("../../../../cores/error.response");
const awsBucket = require("../../../../dbs/init.minio");

class MediaRepository {
  async putObject(params) {
    try {
      return await awsBucket.putObject(params);
    } catch (_) {
      throw new InternalServerError();
    }
  }
}
module.exports = new MediaRepository();
