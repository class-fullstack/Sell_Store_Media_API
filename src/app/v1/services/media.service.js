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
const ValidationMedia = require("../../../commons/helpers/validatehandle");
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

class MediaService {
  async processAndUploadSingleMedia(req) {
    //* 1. Get data for file upload
    const { buffer, mimetype, originalname, size, fieldname } = req.file;
    const { width, height, watermark, text } = req.body;
    const { user_id } = req.infoAccessToken;

    //* 2.  Validate data for file upload
    ValidationMedia.validateFields({
      buffer,
      mimetype,
      originalname,
    });

    const resizedWidth = _.defaults(width, "1024");
    const resizedHeight = _.defaults(height, "1024");

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

    console.log(getFileNameFromPath(originalname), "---");

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
      width: Number(resizedWidth),
      height: Number(resizedHeight),
      watermark,
      text,
      s3Bucket,
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
    width = 1024,
    height = 1024,
    watermark = TYPE.TRUE,
    text,
    s3Bucket,
  }) {
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
    //* 1.  Validate data for file upload
    const { user_id } = req.infoAccessToken;

    ValidationMedia.validateFields({
      s3Bucket,
      urlPath,
      width,
      height,
    });
    //* 2. Take parameters
    let urlParams = {
      Bucket: s3Bucket,
      Key: urlPath,
      ResponseCacheControl: `max-age=${MAX_AGE}`,
      Expires: TIME._10_MINUTE,
    };

    const { Metadata, ContentType, Body } =
      await MediaRepository.getObjectInfoByKey({
        Bucket: urlParams?.Bucket,
        Key: urlParams?.Key,
      });

    if (s3Bucket === S3_BUCKET.IMAGE) {
      const { type } = parseMimeType(ContentType);

      let templateUpload, bucket;
      const fileTypes = {
        [FILE.IMAGE]: {
          templateUpload: TEMPLATE.RESIZE,
          bucket: S3_BUCKET.IMAGE,
        },
      };

      const fileTypeData = fileTypes[type];
      if (fileTypeData) {
        templateUpload = fileTypeData.templateUpload;
        s3Bucket = fileTypeData.bucket;
      }

      //* 3. Adjust image size if width and height are provided
      if (width && height && Metadata) {
        urlParams = {
          ...urlParams,
          Key: `${urlPath}?w=${width}&h=${height}`,
        };
      }

      const processedBuffer = await this.processImage({
        buffer: Buffer.from(Body),
        mimetype: ContentType,
        width: Number(width),
        height: Number(height),
        s3Bucket,
      });

      //* 5. Create Id media
      const mediaId = randomMediaId({
        originalname: Metadata.filename,
        type: Metadata.filetype,
      });

      const urlPathKey = getURIFromTemplate(templateUpload, {
        media_id: mediaId,
        user_id,
        file_name: getFileNameFromPath(Metadata.filename),
        width,
        height,
      });
      const updatedMetadata = {
        ...Metadata,
        width: width.toString(),
        height: height.toString(),
      };

      const params = {
        Bucket: s3Bucket,
        Key: urlPathKey,
        Expires: TIME._10_MINUTE,
        Body: processedBuffer,
        Metadata: updatedMetadata,
        ContentType: ContentType,
      };

      const resultData = await MediaRepository.putObject(params);

      console.info(`upload success ${JSON.stringify(resultData)}`);

      const { media_url } = await this.getSignedUrlPromise({
        s3Bucket,
        urlPath: urlPathKey,
      });

      return {
        s3_bucket: s3Bucket,
        urlPath: urlParams.Key,
        media_url,
        upload_mime: ContentType,
        upload_name: Metadata?.filename,
      };
    }

    const { media_url } = await this.getSignedUrlPromise({
      s3Bucket,
      urlPath: urlPath,
    });

    return {
      s3_bucket: s3Bucket,
      urlPath: urlPath,
      media_url,
      upload_mime: ContentType,
      upload_name: Metadata?.filename,
    };
    //* 4. Get link url of image and return
  }
}

module.exports = new MediaService();
