"use strict";

//* LIB
const crypto = require("crypto");

//* REQUIRED
const { FILE } = require("../constants");
const { BadRequestRequestError } = require("../../cores/error.response");

const randomMediaId = ({ originalname, type }) => {
  let prefix;
  switch (type) {
    case FILE.VIDEO:
      prefix = "VID";
      break;
    case FILE.IMAGE:
      prefix = "IMG";
      break;
    default:
      throw new BadRequestRequestError();
  }
  return `${prefix}_${crypto
    .createHash("md5")
    .update(originalname)
    .digest("hex")}`;
};

module.exports = {
  randomMediaId,
};
