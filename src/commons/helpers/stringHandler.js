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

module.exports = {
  getURIFromTemplate,
  parseMimeType,
  convertMetadataToString,
};
