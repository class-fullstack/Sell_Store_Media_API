//* LIB
const express = require("express");

//* REQUIRE
const mediaController = require("../../controllers/media.controller");
const { asyncHandler } = require("../../../../commons/helpers/asyncHandler");
const { uploadMemory } = require("../../../../commons/configs/multer.config");
const {
  MAX_MEDIA,
  MAX_UPLOAD_MULTIPLE,
} = require("../../../../commons/constants");

const router = express.Router();

router.post(
  "/upload-single",
  uploadMemory.single("image", MAX_MEDIA),
  asyncHandler(mediaController.uploadSingle)
);

module.exports = router;
