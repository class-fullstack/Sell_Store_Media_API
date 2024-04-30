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

  async getSignedUrlPromise(params) {
    try {
      return await awsBucket.getSignedUrlPromise("getObject", params);
    } catch (_) {
      throw new InternalServerError();
    }
  }

  async getAllImageInfoFromBucket(params) {
    try {
      const data = await awsBucket.listObjects(params).promise();
      console.info("Objects in bucket:", data.Contents);
      return data.Contents;
    } catch (_) {
      throw new InternalServerError();
    }
  }

  async getObjectInfoByKey(params) {
    try {
      const data = await awsBucket.getObject(params).promise();
      return data;
    } catch (_) {
      throw new InternalServerError();
    }
  }
}
module.exports = new MediaRepository();
