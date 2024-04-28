//* LIB
const sharp = require("sharp");
const { createCanvas } = require("canvas");
const _ = require("lodash");

//* REQUIRE
const {
  S3_BUCKET,
  FILE,
  TEMPLATE,
  TIME,
  MAX_AGE,
} = require("../../../commons/constants");
const ValidationMedia = require("../../../commons/helpers/validatehandle");
const {
  parseMimeType,
  getURIFromTemplate,
  convertMetadataToString,
} = require("../../../commons/helpers/stringHandler");
const { randomMediaId } = require("../../../commons/helpers/randomHandler");
const MediaRepository = require("../../v1/models/repositories/media.repo");

class MediaService {
  async uploadSingle(req) {
    //* 1. Get data for file upload
    const { buffer, mimetype, originalname, size, fieldname } = req.file;
    const { width, height } = req.body;
    const { user_id } = req.infoAccessToken;

    //* 2.  Validate data for file upload
    ValidationMedia.validateFields({
      buffer,
      mimetype,
      originalname,
      width,
      height,
    });

    //* 3. Split string: video/mp4 => {type: mp4, extension:video}
    const { type, extension } = parseMimeType(mimetype);

    //* 4. Get template for file upload
    let templateUpload, s3Bucket;
    const fileTypes = {
      [FILE.IMAGE]: {
        templateUpload: TEMPLATE.IMAGE,
        s3Bucket: S3_BUCKET.IMAGE,
      },
      [FILE.VIDEO]: {
        templateUpload: TEMPLATE.VIDEO,
        s3Bucket: S3_BUCKET.VIDEO,
      },
    };

    const fileTypeData = fileTypes[type];
    if (fileTypeData) {
      templateUpload = fileTypeData.templateUpload;
      s3Bucket = fileTypeData.s3Bucket;
    }

    //* 5. Create Id media
    const mediaId = randomMediaId({ originalname, type });

    //* 6. Add link template
    const date = new Date().getTime();
    const time = date.toString();

    //* 7. Create path folder save
    const urlPath = getURIFromTemplate(templateUpload, {
      media_id: mediaId,
      user_id,
      time: time,
      file_name: fieldname,
    });

    //* 8. Created metadata object
    const metadata = {
      userId: user_id,
      time: date,
      path: urlPath,
      fileSize: size,
      width,
      height,
      fileName: fieldname,
      fileType: type,
      fileExtension: extension,
    };

    //* 9. Handle image before save S3
    const processedBuffer = await this.processImage({
      buffer,
      mimetype,
      width: Number(width),
      height: Number(height),
    });

    //* 10. Upload file to S3
    const params = {
      Bucket: s3Bucket,
      Key: urlPath,
      Expires: TIME._10_MINUTE,
      Body: processedBuffer,
      Metadata: convertMetadataToString(metadata),
      ContentType: mimetype,
    };
    const resultData = await MediaRepository.putObject(params);

    console.info(`upload success ${JSON.stringify(resultData)}`);
    return {
      upload_mime: mimetype,
      upload_name: fieldname,
      upload_url: await this.getSignedUrlPromise({ s3Bucket, urlPath }),
      upload_id: getURIFromTemplate(TEMPLATE.STORAGE, {
        user_id,
        file_name: encodeURIComponent(fieldname),
      }),
    };
  }

  async createTextImage({
    text = "Nguyen Tien Tai",
    font,
    fontSize,
    textColor,
    canvasWidth,
    canvasHeight,
  }) {
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
  }

  async processImage({ buffer, mimetype, width = 800, height = 600 }) {
    let resizedBuffer, processedBuffer;
    if (_.includes(["image/jpeg", "image/png"], mimetype)) {
      //* 1. Resize image to 800x600 pixels
      resizedBuffer = await sharp(buffer)
        .resize({ width: width, height: height })
        .toBuffer();

      //* 2. Draw watermark into image
      const textBuffer = await this.createTextImage({
        text: "Nguyen Tien Tai",
        font: "Arial",
        fontSize: 24,
        textColor: "rgba(255, 255, 255, 0.7)",
        canvasWidth: width,
        canvasHeight: height,
      });

      //*  3. Watermark into image
      processedBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, gravity: "southeast" }])
        .toBuffer();
    } else {
      //* 4. If deference image return buffer
      processedBuffer = buffer;
    }
    return processedBuffer;
  }

  async getSignedUrlPromise({ s3Bucket, urlPath }) {
    const urlParams = {
      Bucket: s3Bucket,
      Key: urlPath,
      ResponseCacheControl: `max-age=${MAX_AGE}`,
      Expires: TIME._10_MINUTE,
    };
    return await MediaRepository.getSignedUrlPromise(urlParams);
  }
}

module.exports = new MediaService();
