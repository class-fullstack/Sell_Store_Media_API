"use strict";

//* LIB
const multer = require("multer");
const { isEmpty, isNull } = require("lodash");

//* REQUIRED
const { BadRequestRequestError } = require("../../cores/error.response");

// limit store 1MB
const LIMIT = 1000000;
const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: LIMIT },
  fileFilter: (_, file, cb) => {
    //* 1. Check file if empty or null
    if (isEmpty(file) || isNull(file)) {
      return cb(new BadRequestRequestError());
    }

    //* 2. Check file type
    const allowedFiletypes = /jpeg|jpg|png|gif/;
    const isAllowedMimetype = allowedFiletypes.test(file?.mimetype);

    //* 3. Check file if it not must is system regulations
    if (!isAllowedMimetype) {
      return cb(new BadRequestRequestError());
    }

    //* 4. all conditions Ok next
    return cb(null, true);
  },
});

module.exports = {
  uploadMemory,
};
