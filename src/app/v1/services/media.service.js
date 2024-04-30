//* LIB
const _ = require("lodash");

//* REQUIRE
const {
  S3_BUCKET,
  FILE,
  TEMPLATE,
  TIME,
  MAX_AGE,
  TYPE,
} = require("../../../commons/constants");
const ValidationMedia = require("../../../commons/helpers/validatehandler.js");
const {
  parseMimeType,
  getURIFromTemplate,
  convertMetadataToString,
  getFileNameFromPath,
  cutStringFromChar,
} = require("../../../commons/helpers/stringHandler");
const { randomMediaId } = require("../../../commons/helpers/randomHandler");
const MediaRepository = require("../../v1/models/repositories/media.repo");
const { detectFileType } = require("../../../commons/helpers/detectHandler");
const {
  createTextImage,
} = require("../../../commons/helpers/canvasHandler.js");
const {
  resizeImage,
  addWatermark,
} = require("../../../commons/helpers/sharpHandler");
const { BadRequestRequestError } = require("../../../cores/error.response.js");

class MediaService {
  async processAndUploadSingleMedia(req) {
    //* 1. Get data for file upload
    const { buffer, mimetype, originalname, size } = req.file;
    const { width, height, watermark, text } = req.body;
    const { user_id } = req.infoAccessToken;

    //* 2.  Validate data for file upload
    ValidationMedia.validateFields({
      buffer,
      mimetype,
      originalname,
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

    //* 7. Create path folder save
    const urlPath = getURIFromTemplate(templateUpload, {
      media_id: mediaId,
      user_id,
      file_name: getFileNameFromPath(originalname),
    });

    //* 8. Created metadata object
    const metadata = {
      userId: user_id,
      time: date,
      path: urlPath,
      fileSize: size,
      width,
      height,
      fileName: originalname,
      fileType: type,
      fileExtension: extension,
    };

    //* 9. Handle image before save S3
    const processedBuffer = await this.processImage({
      buffer,
      mimetype,
      width: width ?? 1024,
      height: height ?? 1024,
      watermark,
      text,
      s3Bucket,
    });
    console.log(getFileNameFromPath(originalname), "---");

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

    //* 11. Get signed url
    const { media_url } = await this.getSignedUrlPromise({
      s3Bucket,
      urlPath,
    });

    //* 12. Return data
    return {
      upload_mime: mimetype,
      upload_name: originalname,
      s3_bucket: s3Bucket,
      urlPath: cutStringFromChar({ str: urlPath, char: "?" }),
      media_url,
    };
  }

  async processImage({
    buffer,
    mimetype,
    width,
    height,
    watermark = TYPE.TRUE,
    text,
    s3Bucket,
  }) {
    console.log(width, height);
    let processedBuffer, textBuffer;

    //* 1. Get File type => image/jpeg,...
    const fileType = detectFileType({ contentType: mimetype });

    //* 2. Check file type
    if (fileType !== null) {
      //* 1. Resize image to 800x600 pixels
      processedBuffer = await resizeImage({ buffer, height, width });

      //* 2.  Check if want watermark into image
      const isShouldImage =
        watermark === TYPE.TRUE && text && s3Bucket === S3_BUCKET.IMAGE;
      if (isShouldImage) {
        //* 1. Draw watermark into image
        textBuffer = await createTextImage({
          text: text ?? "Nguyen Tien Tai",
          font: "Arial",
          fontSize: 22,
          textColor: "rgba(255, 255, 255, 0.7)",
          canvasWidth: width,
          canvasHeight: height,
        });

        //* 2. Watermark into image
        processedBuffer = await addWatermark({
          buffer,
          textBuffer,
        });
      }
    } else {
      //* 3. If deference image return buffer
      processedBuffer = buffer;
    }
    return processedBuffer;
  }

  async getSignedUrlPromise({ s3Bucket, urlPath }) {
    //* 1.  Validate data for file upload
    ValidationMedia.validateFields({
      s3Bucket,
      urlPath,
    });

    //* 2. Params of image
    const urlParams = {
      Bucket: s3Bucket,
      Key: urlPath,
      ResponseCacheControl: `max-age=${MAX_AGE}`,
      Expires: TIME._10_MINUTE,
    };

    //* 4. Get link url of image and return
    return {
      s3_bucket: s3Bucket,
      urlPath: urlPath,
      media_url: await MediaRepository.getSignedUrlPromise(urlParams),
    };
  }

  async getSignedUrl(req, { s3Bucket, urlPath, width, height }) {
    //* 1. Get id of user for token
    const { user_id } = req.infoAccessToken;

    //* 2.  Validate data for file upload
    ValidationMedia.validateFields({
      s3Bucket,
      urlPath,
      width,
      height,
    });

    //* 3. get Info object key
    const { metadata, contentType, buffer } = await this.processObjectInfoKey({
      s3Bucket,
      urlPath,
    });

    //* 4. if bucket is image and have width and height
    const isBucketImageAndSize =
      s3Bucket === S3_BUCKET.IMAGE && width && height;
    if (isBucketImageAndSize) {
      //* 1. Resize image have resize width x height pixels
      const { s3_bucket, urlPath, media_url, upload_mime, upload_name } =
        await this.processImageResize({
          width,
          height,
          metadata,
          buffer,
          contentType,
          s3Bucket,
          user_id,
        });

      return {
        s3_bucket,
        urlPath,
        media_url,
        upload_mime,
        upload_name,
      };
    }

    //* 5 If key not have resized
    const { media_url } = await this.getSignedUrlPromise({
      s3Bucket,
      urlPath: urlPath,
    });

    return {
      s3_bucket: s3Bucket,
      urlPath: urlPath,
      media_url,
      upload_mime: contentType,
      upload_name: metadata?.filename,
    };
    //* 4. Get link url of image and return
  }

  async processImageResize({
    width,
    height,
    s3Bucket,
    metadata,
    buffer,
    contentType,
    user_id,
  }) {
    // * 1. Processing image size
    const processedBuffer = await this.processImage({
      buffer,
      mimetype: contentType,
      width: Number(width),
      height: Number(height),
      s3Bucket,
    });

    //* 2. Create Id media
    const mediaId = randomMediaId({
      originalname: metadata?.filename,
      type: metadata?.filetype,
    });

    //* 3. Create path folder save
    const urlPathKey = getURIFromTemplate(TEMPLATE.RESIZE, {
      media_id: mediaId,
      user_id,
      file_name: getFileNameFromPath(metadata?.filename),
      width,
      height,
    });

    //* 4. Created metadata object
    const updatedMetadata = {
      ...metadata,
      width: width.toString(),
      height: height.toString(),
    };

    //* 5. Create params object
    const params = {
      Bucket: s3Bucket,
      Key: urlPathKey,
      Expires: TIME._10_MINUTE,
      Body: processedBuffer,
      Metadata: updatedMetadata,
      ContentType: contentType,
    };

    //* 6 Save metadata object S3
    const resultData = await MediaRepository.putObject(params);
    console.info(`upload success ${JSON.stringify(resultData)}`);

    //* 7. Get signed url
    const { media_url } = await this.getSignedUrlPromise({
      s3Bucket,
      urlPath: urlPathKey,
    });

    //* 8. Return data
    return {
      s3_bucket: s3Bucket,
      urlPath: urlPathKey,
      media_url,
      upload_mime: contentType,
      upload_name: metadata?.filename,
    };
  }

  async processObjectInfoKey({ s3Bucket, urlPath }) {
    //* 4. Get link info url of image and return
    const { Metadata, ContentType, Body } =
      await MediaRepository.getObjectInfoByKey({
        Bucket: s3Bucket,
        Key: urlPath,
      });

    //* 5. Check key not exits
    if (!_.isObject(Metadata)) {
      throw new BadRequestRequestError();
    }
    return {
      metadata: Metadata,
      contentType: ContentType,
      buffer: Buffer.from(Body),
    };
  }
}

module.exports = new MediaService();
