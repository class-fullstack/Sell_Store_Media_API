"use strict";

//* LIB
const express = require("express");
const {
  ReasonPhrases,
  StatusCodes,
} = require("../../../commons/utils/httpStatusCode");
const HeaderMiddleware = require("../../../middlewares/headers.middleware");
const router = express.Router();

//* Get all headers
router.use(HeaderMiddleware.getHeaders);

router.use("/media", require("./media"));

router.get("/", async (_, res, __) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: ReasonPhrases.OK,
    timestamp: Date.now(),
  };
  return res.status(StatusCodes.OK).json(healthCheck);
});

module.exports = router;
