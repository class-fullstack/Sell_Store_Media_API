//* LIB
const AWS = require("aws-sdk");

//* REQUIRE
const {
  S3: {
    endpoint,
    accessKeyId,
    secretAccessKey,
    region,
    sslEnabled,
    s3ForcePathStyle,
    signatureVersion,
    useAccelerateEndpoint,
    useDualstackEndpoint,
    httpOptions,
  },
} = require("../commons/configs/minio.config");

const localSetup = {
  endpoint,
  accessKeyId,
  secretAccessKey,
  region,
  sslEnabled,
  s3ForcePathStyle,
  signatureVersion,
  useAccelerateEndpoint,
  useDualstackEndpoint,
  httpOptions,
};

const awsBucket = new AWS.S3(localSetup);

module.exports = awsBucket;
