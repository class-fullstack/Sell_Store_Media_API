"use strict";

//* REQUIRE
const { BadRequestRequestError } = require("../../../../cores/error.response");
const awsBucket = require("../../../../dbs/init.minio").getAwsBucket();

class MediaRepository {
  async putObject(params) {
    try {
      return await awsBucket.putObject(params).promise();
    } catch (_) {
      throw new BadRequestRequestError();
    }
  }

  async getSignedUrlPromise(params) {
    try {
      return await awsBucket.getSignedUrlPromise("getObject", params);
    } catch (_) {
      throw new BadRequestRequestError();
    }
  }

  async getAllImageInfoFromBucket(params) {
    try {
      const data = await awsBucket.listObjects(params).promise();
      return data.Contents;
    } catch (_) {
      throw new BadRequestRequestError();
    }
  }

  async getObjectInfoByKey(params) {
    try {
      return await awsBucket.getObject(params).promise();
    } catch (_) {
      throw new BadRequestRequestError();
    }
  }

  async deleteObjects(params) {
    try {
      return await awsBucket.deleteObjects(params).promise();
    } catch (_) {
      throw new BadRequestRequestError();
    }
  }

  async getHeadObject(params) {
    try {
      return await awsBucket.headObject(params).promise();
    } catch (_) {
      throw new BadRequestRequestError();
    }
  }
}
module.exports = new MediaRepository();
