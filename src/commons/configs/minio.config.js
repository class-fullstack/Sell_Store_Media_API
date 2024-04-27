const DEV = {
  S3: {
    endpoint: process.env.AWS_ENDPOINT,
    accessKeyId: process.env.AWS_ACCESS,
    secretAccessKey: process.env.AWS_SECRET,
    sslEnabled: process.env.AWS_SSL,
    s3ForcePathStyle: process.env.AWS_FORCE_STYLE,
  },
};
const PRO = {
  S3: {
    endpoint: process.env.AWS_ENDPOINT,
    accessKeyId: process.env.AWS_ACCESS,
    secretAccessKey: process.env.AWS_SECRET,
    sslEnabled: process.env.AWS_SSL,
    s3ForcePathStyle: process.env.AWS_FORCE_STYLE,
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
