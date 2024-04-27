const crypto = require("crypto");

//* REQUIRE
const awsBucket = require("../../../dbs/init.minio");
const { S3_BUCKET } = require("../../../commons/constants");
const ValidationMedia = require("../../../commons/helpers/validatehandle");

class MediaService {
  async uploadSingle(req) {
    //* 1. Get data for file upload
    const { buffer, mimetype, originalname } = req.file;

    //* 2.  Validate data for file upload
    ValidationMedia.validateFields({ buffer, mimetype, originalname });

    const ContentType = { ContentType: mimetype };

    const hash = crypto.createHash("md5").update(originalname).digest("hex");
    const key = hash + "_" + originalname;

    const params = {
      Bucket: S3_BUCKET,
      Key: key,
      Body: buffer,
      ...ContentType,
    };

    const data = await awsBucket.putObject(params).promise();
    console.info(`upload success ${JSON.stringify(data)}`);
    return data;
  }
}

module.exports = new MediaService();
