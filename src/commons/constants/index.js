const NODE_ENV = {
  DEV: "dev",
  PRO: "pro",
};

const LIMIT_BODY = {
  _5_MB: "5mb",
};

const TIME = {
  _15_SECOND: 15 * 1000,
  _1_MINUTE: 60,
  _3_MINUTE: 3 * 60,
};

const S3_BUCKET = "taidev";
const MAX_MEDIA = 1;
const MAX_UPLOAD_MULTIPLE = 10;
const MAX_AGE = 3600;

module.exports = {
  NODE_ENV,
  LIMIT_BODY,
  TIME,
  S3_BUCKET,
  MAX_MEDIA,
  MAX_AGE,
  MAX_UPLOAD_MULTIPLE,
};
