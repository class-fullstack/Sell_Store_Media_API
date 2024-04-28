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

module.exports = {
  getURIFromTemplate,
  parseMimeType,
};
