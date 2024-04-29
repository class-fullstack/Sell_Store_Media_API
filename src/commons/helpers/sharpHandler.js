//* LIB
const sharp = require("sharp");

const resizeImage = async ({ buffer, width, height }) => {
  return await sharp(buffer)
    .resize({ width: width, height: height })
    .toBuffer();
};

const addWatermark = async ({ buffer, textBuffer }) => {
  return await sharp(buffer)
    .composite([{ input: textBuffer, gravity: "southeast" }])
    .toBuffer();
};
module.exports = {
  resizeImage,
  addWatermark,
};
