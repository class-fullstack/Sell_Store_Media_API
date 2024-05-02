//* REQUIRE
const { SuccessResponse, Created } = require("../../../cores/success.response");
const mediaService = require("../services/media.service");

class MediaController {
  async processAndUploadSingleMedia(req, res, ___) {
    new Created({
      metadata: await mediaService.processAndUploadSingleMedia(req),
    }).send(res);
  }

  async generateSignedUrlResponse(req, res, ___) {
    const { bucket, url_path, width, height } = req.query;
    new SuccessResponse({
      metadata: await mediaService.getSignedUrl(req, {
        s3Bucket: bucket,
        urlPath: url_path,
        width,
        height,
      }),
    }).send(res);
  }

  async deleteObjectsFolder(req, res, ___) {
    const { bucket, url_path } = req.query;
    new SuccessResponse({
      metadata: await mediaService.deleteObjectsFolder({
        s3Bucket: bucket,
        urlPath: url_path,
      }),
    }).send(res);
  }

  async deleteS3Object(req, res, ___) {
    const { bucket, url_path } = req.query;
    new SuccessResponse({
      metadata: await mediaService.deleteS3Object({
        s3Bucket: bucket,
        urlPath: url_path,
      }),
    }).send(res);
  }

  async getMetadataS3Object(req, res, ___) {
    const { bucket, url_path } = req.query;
    new SuccessResponse({
      metadata: await mediaService.getObjectInfoMetadata({
        s3Bucket: bucket,
        urlPath: url_path,
      }),
    }).send(res);
  }

  async getAllMediaInfo(req, res, ___) {
    const { bucket, prefix, delimiter, maxKeys } = req.query;
    new SuccessResponse({
      metadata: await mediaService.getAllMediaInfo({
        s3Bucket: bucket,
        prefix,
        delimiter,
        maxKeys,
      }),
    }).send(res);
  }

  async putObjectS3Multiple(req, res, ___) {
    new SuccessResponse({
      metadata: await mediaService.putObjectS3Multiple(req),
    }).send(res);
  }
}

module.exports = new MediaController();
