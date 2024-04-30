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
}

module.exports = new MediaController();
