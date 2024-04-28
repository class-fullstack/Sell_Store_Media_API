//* REQUIRE
const {
  app: { node },
} = require("../../commons/configs/app.config");
const { NODE_ENV, TIME } = require("../constants");

const DEV = {
  S3: {
    endpoint: process.env.AWS_ENDPOINT,
    accessKeyId: process.env.AWS_ACCESS,
    secretAccessKey: process.env.AWS_SECRET,
    region: process.env.AWS_REGION,
    sslEnabled: node === NODE_ENV.DEV ? false : true,
    s3ForcePathStyle: process.env.AWS_FORCE_STYLE,
    useAccelerateEndpoint: process.env.AWS_USE_ACCELERATE_ENDPOINT,
    useDualstackEndpoint: process.env.AWS_USE_DUALSTACK_ENDPOINT,
    signatureVersion: process.env.AWS_SIGNATURE_VERSION,
    httpOptions: {
      timeout: TIME._10_MINUTE,
    },
  },
};
const PRO = {
  S3: {
    endpoint: process.env.AWS_ENDPOINT,
    accessKeyId: process.env.AWS_ACCESS,
    secretAccessKey: process.env.AWS_SECRET,
    region: process.env.AWS_REGION,
    sslEnabled: node === NODE_ENV.PRO ? true : false,
    s3ForcePathStyle: process.env.AWS_FORCE_STYLE,
    signatureVersion: process.env.AWS_SIGNATURE_VERSION,
    useAccelerateEndpoint: process.env.AWS_USE_ACCELERATE_ENDPOINT,
    useDualstackEndpoint: process.env.AWS_USE_DUALSTACK_ENDPOINT,
    httpOptions: {
      timeout: TIME._10_MINUTE,
    },
  },
};
const config = { DEV, PRO };

const env = process.env.NODE_ENV || "DEV";

const getConfigS3 = (env) => {
  if (env === process.env.NODE_ENV) return config.DEV;
  if (env === process.env.NODE_ENV) return config.PRO;
  return null;
};

module.exports = getConfigS3(env);
