//* LIB
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { default: helmet } = require("helmet");
const compression = require("compression");
const dotenv = require("dotenv");

//* REQUIRE
const { NODE_ENV, LIMIT_BODY } = require("./commons/constants");
const { errorHandler } = require("./commons/helpers/errorHandle");
const {
  StatusCodes,
  ReasonPhrases,
} = require("./commons/utils/httpStatusCode");

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  express.json({
    limit: LIMIT_BODY._5_MB,
  })
);

//* PG
require("./dbs/init.knex").initDatabase();
require("./dbs/init.minio").initAwsBucket();

// * V1
app.use("/api/v1", require("./app/v1/routes"));

app.use((_, __, next) => {
  const error = new Error(ReasonPhrases.NOT_FOUND);
  error.status = StatusCodes.NOT_FOUND;
  return next(error);
});

app.use((error, __, res, ____) => {
  const checkNodeApp = process.env.NODE_ENV === NODE_ENV.DEV;
  try {
    const resultError = errorHandler(error, checkNodeApp);

    return res.status(resultError?.response.status).json(resultError?.response);
  } catch (error) {
    const resultError = errorHandler(error, checkNodeApp);
    return res.status(resultError?.response.status).json(resultError?.response);
  }
});

module.exports = app;
