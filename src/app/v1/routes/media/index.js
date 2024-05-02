//* LIB
const express = require("express");

//* REQUIRE
const mediaController = require("../../controllers/media.controller");
const { asyncHandler } = require("../../../../commons/helpers/asyncHandler");
const { uploadMemory } = require("../../../../commons/configs/multer.config");
const {
  MAX_MEDIA,
  KEY_UPLOAD,
  MAX_MEDIA_MULTIPLE,
} = require("../../../../commons/constants");
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

//* 2. Get flow keys of image and video, if image it will have resize image
router.get(
  "/generate-signed-url",
  asyncHandler(mediaController.generateSignedUrlResponse)
);

//* 3. Delete object link folders
router.get(
  "/delete-folder-link",
  asyncHandler(mediaController.deleteObjectsFolder)
);

//* 4. Delete object link key
router.get("/delete-link", asyncHandler(mediaController.deleteS3Object));

//* 5. Get object Metadata
router.get("/info-metadata", asyncHandler(mediaController.getMetadataS3Object));

//* 6. Get all buckets
router.get("/get-buckets", asyncHandler(mediaController.getAllMediaInfo));

//* 7. Upload multiple media
router.post(
  "/upload-multiple",
  uploadMemory.array(KEY_UPLOAD.MULTIPLE, MAX_MEDIA_MULTIPLE),
  asyncHandler(mediaController.putObjectS3Multiple)
);

module.exports = router;
