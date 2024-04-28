"use strict";

//* LIB
const multer = require("multer");
const { isEmpty, isNull } = require("lodash");

//* REQUIRED
const { BadRequestRequestError } = require("../../cores/error.response");
const { MEDIA_TYPE } = require("../constants");

// limit store 10MB
const LIMIT = 10 * 1024 * 1024;
const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fieldNameSize: 100, fileSize: LIMIT },
  fileFilter: (req, file, cb) => {
    //* 1. Check file if empty or null
    if (isEmpty(file) || isNull(file)) {
      return cb(new BadRequestRequestError());
    }

    //* 2. Check file type
    const allowedFiletypes = MEDIA_TYPE;
    const isAllowedMimetype = allowedFiletypes.test(file?.mimetype);

    //* 3. Check file if it not must is system regulations
    if (!isAllowedMimetype) {
      return cb(new BadRequestRequestError());
    }

    //* 4. Check size
    const fileSize = parseInt(req?.headers["content-length"]);

    if (fileSize > LIMIT) {
      return cb(new BadRequestRequestError("more_than_size"));
    }

    //* 5. all conditions Ok next
    return cb(null, true);
  },
});

module.exports = {
  uploadMemory,
};
