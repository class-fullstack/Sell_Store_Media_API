//* LIB
const { createCanvas } = require("canvas");

const createTextImage = ({
  text = "Nguyen Tien Tai",
  font,
  fontSize,
  textColor,
  canvasWidth,
  canvasHeight,
}) => {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");

  // Đặt font và kích thước
  //* 1. Set font and size
  ctx.font = `${fontSize}px ${font}`;
  ctx.fillStyle = textColor;

  //* 2. Measure size of word
  const textMetrics = ctx.measureText(text);
  const textWidth = textMetrics.width;
  const textHeight = fontSize;

  //* 3. Draw text to the canvas in the bottom left corner
  ctx.fillText(text, canvasWidth - textWidth, canvasHeight - textHeight);

  //* 4. convert canvas to buffer
  return canvas.toBuffer();
};

module.exports = {
  createTextImage,
};
