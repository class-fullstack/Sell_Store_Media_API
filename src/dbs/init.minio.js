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
const { S3_BUCKET } = require("../commons/constants");

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
let awsBucket, connectTimeout;
const TIMEOUT_DURATION_MS = 10000; // 10 seconds

const handleTimeoutError = (error) => {
  console.error(error);
  connectTimeout = setTimeout(() => {
    console.error("Failed to connect to S3 Bucket");
    throw new Error("Failed to connect to S3 Bucket");
  }, TIMEOUT_DURATION_MS);
};

const handleEventConnect = () => {
  console.info("CONNECTED TO S3 BUCKET SUCCESS 🦩!!");
  clearTimeout(connectTimeout);
  return;
};

const initAwsBucket = async () => {
  awsBucket = new AWS.S3(localSetup);
  try {
    await awsBucket.headBucket({ Bucket: S3_BUCKET.IMAGE }).promise();
    handleEventConnect();
  } catch (error) {
    handleTimeoutError(error);
  }
};

const getAwsBucket = () => awsBucket;

const closeAwsBucket = () => {
  if (awsBucket) {
    awsBucket.destroy();
    awsBucket = undefined;
    console.log("S3 connection closed");
  }
};

module.exports = {
  getAwsBucket,
  closeAwsBucket,
  initAwsBucket,
};
