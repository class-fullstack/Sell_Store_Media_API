//* LIB
const express = require("express");

//* REQUIRE
const mediaController = require("../../controllers/media.controller");
const { asyncHandler } = require("../../../../commons/helpers/asyncHandler");
const { uploadMemory } = require("../../../../commons/configs/multer.config");
const { MAX_MEDIA, KEY_UPLOAD } = require("../../../../commons/constants");

const router = express.Router();

router.post(
  "/upload-single",
  uploadMemory.single(KEY_UPLOAD.SINGLE, MAX_MEDIA),
  asyncHandler(mediaController.uploadSingle)
);

module.exports = router;
