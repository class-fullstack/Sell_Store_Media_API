"use strict";

const detectFileType = ({ contentType }) => {
  const FILE_TYPES = {
    IMAGE: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    VIDEO: [
      "video/mp2ts",
      "video/mp2t",
      "video/mp3",
      "video/3gp",
      "video/ogg",
      "video/x-msvideo",
      "video/quicktime",
    ],
  };

  for (const type in FILE_TYPES) {
    if (FILE_TYPES[type].includes(contentType)) {
      return type;
    }
  }
  return null;
};

module.exports = {
  detectFileType,
};
