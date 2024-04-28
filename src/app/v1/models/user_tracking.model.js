"use strict";

//* REQUIRE
const { TABLES } = require("../../../commons/constants");
const { InternalServerError } = require("../../../cores/error.response");
const knexInstance = require("../../../dbs/init.knex").getDatabase();

class UserTrackingModels {
  async getUserTracking(dataQuery, returnFields) {
    try {
      const result = await knexInstance(TABLES.USER_TRACKING)
        .where(dataQuery)
        .select(returnFields)
        .first();
      return result;
    } catch (_) {
      throw new InternalServerError();
    }
  }
}
module.exports = new UserTrackingModels();
