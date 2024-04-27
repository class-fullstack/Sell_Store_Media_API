//* REQUIRE
const { SuccessResponse } = require("../../../cores/success.response");
const mediaService = require("../services/media.service");

class MediaController {
  async uploadSingle(req, res, ___) {
    new SuccessResponse({
      metadata: await mediaService.uploadSingle(req),
    }).send(res);
  }
}

module.exports = new MediaController();
