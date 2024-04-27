const crypto = require("crypto");

//* REQUIRE
const awsBucket = require("../../../dbs/init.minio");
const { S3_BUCKET } = require("../../../commons/constants");

class MediaService {
  async uploadSingle(req) {
    try {
      const buffer = req?.file?.buffer;
      const mime = req?.file?.mimetype;
      const ContentType = { ContentType: mime };

      const originalFileName = req.file.originalname;
      const hash = crypto
        .createHash("md5")
        .update(originalFileName)
        .digest("hex");
      const key = hash + "_" + originalFileName;

      const params = {
        Bucket: S3_BUCKET,
        Key: key,
        Body: buffer,
        ...ContentType,
      };

      const data = await awsBucket.putObject(params).promise();
      console.info(`upload success ${JSON.stringify(data)}`);
      return data;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }
}

module.exports = new MediaService();
