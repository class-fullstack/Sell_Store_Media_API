//* LIB
const AWS = require("aws-sdk");

//* REQUIRE
const {
  S3: { endpoint, accessKeyId, secretAccessKey, sslEnabled, s3ForcePathStyle },
} = require("../commons/configs/minio.config");

const localSetup = {
  endpoint,
  accessKeyId,
  secretAccessKey,
  sslEnabled,
  s3ForcePathStyle,
};

const awsBucket = new AWS.S3(localSetup);

module.exports = awsBucket;
