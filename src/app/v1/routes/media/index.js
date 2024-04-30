//* LIB
const express = require("express");

//* REQUIRE
const mediaController = require("../../controllers/media.controller");
const { asyncHandler } = require("../../../../commons/helpers/asyncHandler");
const { uploadMemory } = require("../../../../commons/configs/multer.config");
const { MAX_MEDIA, KEY_UPLOAD } = require("../../../../commons/constants");
const UserTrackingMiddleware = require("../../../../middlewares/tracking.middleware");
const AuthMiddleware = require("../../../../middlewares/authentication.middleware");

const router = express.Router();

//* Check Info tracking transmit information to headers anh check device users have exits
router.use(UserTrackingMiddleware.checkTracking);

//* Check accessToken of users
router.use(AuthMiddleware.checkToken);

//* 1. Upload single media
router.post(
  "/upload-single",
  uploadMemory.single(KEY_UPLOAD.SINGLE, MAX_MEDIA),
  asyncHandler(mediaController.processAndUploadSingleMedia)
);

//* 2. Get
router.get(
  "/generate-signed-url",
  asyncHandler(mediaController.generateSignedUrlResponse)
);

module.exports = router;
