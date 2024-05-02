const NODE_ENV = {
  DEV: "DEV",
  PRO: "PRO",
};

const LIMIT_BODY = {
  _5_MB: "5mb",
};

const TIME = {
  _15_SECOND: 15 * 1000,
  _1_MINUTE: 60 * 1000,
  _3_MINUTE: 3 * 60 * 1000,
  _10_MINUTE: 10 * 60 * 1000,
};

const S3_BUCKET = {
  IMAGE: "sell-store",
  VIDEO: "sell-store-video",
};
const MAX_MEDIA = 1;
const MAX_MEDIA_MULTIPLE = 5;
const MAX_UPLOAD_MULTIPLE = 10;
const MAX_AGE = 3600;
const KEY_UPLOAD = {
  SINGLE: "image-single",
  MULTIPLE: "image-multiple",
};

const FILE = {
  IMAGE: "image",
  VIDEO: "video",
};

const TEMPLATE = {
  IMAGE: "${user_id}/${media_id}/${file_name}",
  VIDEO: "${user_id}/${media_id}/${file_name}",
  RESIZE: "${user_id}/${media_id}/resize/${file_name}?w=${width}&h=${height}",
};

const MEDIA_TYPE = /jpeg|jpg|png|gif|mp3|mp4/;

const ROLE_TYPE = {
  ADMIN: 10,
  USER: 20,
  STAFF: 30,
};

const TABLES = {
  USER_TRACKING: "user_tracking",
};

const VALIDATE = {
  IS_EMPTY: "is_empty",
  HAD_EXPIRY: "had_expires",
  TOKEN_EXPIRY: "token_exp_expires",
};

const TYPE = {
  TRUE: "1",
  FALSE: "0",
};

module.exports = {
  NODE_ENV,
  LIMIT_BODY,
  TIME,
  S3_BUCKET,
  MAX_MEDIA,
  MAX_AGE,
  MAX_UPLOAD_MULTIPLE,
  KEY_UPLOAD,
  FILE,
  TEMPLATE,
  MEDIA_TYPE,
  ROLE_TYPE,
  TABLES,
  VALIDATE,
  TYPE,
  MAX_MEDIA_MULTIPLE,
};
