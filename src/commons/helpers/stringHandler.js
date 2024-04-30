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

const parseMimeType = (mimeType) => {
  const [type, extension] = mimeType.split("/").map((part) => part.trim());
  return { type, extension };
};

const convertMetadataToString = (metadata) => {
  let convertedMetadata = {};
  _.forOwn(metadata, (value, key) => {
    convertedMetadata[key] = _.isNil(value) ? "" : value.toString();
  });
  return convertedMetadata;
};

const getFileNameFromPath = (path) => {
  const lastDotIndex = path.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return path;
  }
  const fileName = path.substring(0, lastDotIndex);

  return fileName;
};

const cutStringFromChar = ({ str, char }) => {
  const index = str.indexOf(char);
  if (index !== -1) {
    return str.substring(0, index);
  }
  return str;
};

module.exports = {
  getURIFromTemplate,
  parseMimeType,
  convertMetadataToString,
  getFileNameFromPath,
  cutStringFromChar,
};
