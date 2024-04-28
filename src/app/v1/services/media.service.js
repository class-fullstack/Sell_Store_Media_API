//* LIB
const mime = require("mime");

//* REQUIRE
const awsBucket = require("../../../dbs/init.minio");
const { S3_BUCKET, FILE, TEMPLATE } = require("../../../commons/constants");
const ValidationMedia = require("../../../commons/helpers/validatehandle");
const { BadRequestRequestError } = require("../../../cores/error.response");
const {
  parseMimeType,
  getURIFromTemplate,
} = require("../../../commons/helpers/stringHandler");
const { randomMediaId } = require("../../../commons/helpers/randomHandler");

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
    let date = new Date().getTime();

    const urlPath = getURIFromTemplate(templateUpload, {
      media_id: mediaId,
      user_id,
      time: date,
      file_name: fieldname,
    });

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

    // const params = {
    //   Bucket: S3_BUCKET.IMAGE,
    //   Key: key,
    //   Body: buffer,
    //   ...ContentType,
    // };

    return urlPath;

    // const data = await awsBucket.putObject(params).promise();
    // console.info(`upload success ${JSON.stringify(data)}`);
    // return data;
  }
}

module.exports = new MediaService();
