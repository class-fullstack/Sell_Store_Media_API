//* LIB
const _ = require("lodash");

//* REQUIRE
const { BadRequestRequestError } = require("../../cores/error.response");

class ValidationMedia {
  validateFields(fields) {
    for (const [__, value] of Object.entries(fields)) {
      if (_.isNull(value)) {
        throw new BadRequestRequestError();
      }

      if (_.isString(value)) {
        if (_.isEmpty(value)) {
          throw new BadRequestRequestError();
        }
      }
    }
    return this;
  }
}
module.exports = new ValidationMedia();
