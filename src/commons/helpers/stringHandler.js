"use strict";

//* LIB
const _ = require("lodash");

const getURIFromTemplate = (template, data) => {
  return template.replace(/\${(\w+)}/g, (match, key) => {
    if (_.has(data, key)) {
      return data[key];
    }
    return match;
  });
};

// Output: "image/jpeg" => { type: "image", extension: "jpeg" }
const parseMimeType = (mimeType) => {
  const [type, extension] = mimeType.split("/").map((part) => part.trim());
  return { type, extension };
};

// const metadata = {
//   name: "tai",
//   age: 24,
//   city: null,
// };
// In ra: { name: "tai", age: "24", city: "" }
const convertMetadataToString = (metadata) => {
  let convertedMetadata = {};
  _.forOwn(metadata, (value, key) => {
    convertedMetadata[key] = _.isNil(value) ? "" : value.toString();
  });
  return convertedMetadata;
};

// Output: file.txt => file
const getFileNameFromPath = (path) => {
  const lastDotIndex = path.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return path;
  }
  const fileName = path.substring(0, lastDotIndex);

  return fileName;
};

//OutPut: tai?w=801&h=601 => tai || {string: "tai?w=801&h=601" char: "?" }
const cutStringFromChar = ({ str, char }) => {
  const index = str.indexOf(char);
  if (index !== -1) {
    return str.substring(0, index);
  }
  return str;
};

// OutPut: "13/IMG_d61da5bc25bc8cf601dc/resize/tai?w=801&h=601"=> In ra: "13/IMG_d61da5bc25bc8cf601dc"
const extractFolderName = ({ url }) => {
  const firstSlashIndex = url.indexOf("/");
  const secondSlashIndex = url.indexOf("/", firstSlashIndex + 1);
  const folderName = url.substring(0, secondSlashIndex);
  return folderName;
};

module.exports = {
  getURIFromTemplate,
  parseMimeType,
  convertMetadataToString,
  getFileNameFromPath,
  cutStringFromChar,
  extractFolderName,
};
