//* LIB
const _ = require("lodash");

//* REQUIRE
const { verifyToken } = require("../auth/token.auth");
const { ROLE_TYPE, VALIDATE } = require("../commons/constants");
const { getInfoHeaders } = require("../commons/helpers/headerHandler");
const { isTokenExpired } = require("../commons/helpers/timeHandler");
const { UnauthorizedError } = require("../cores/error.response");

class AuthMiddleware {
  static async checkToken(req, __, next) {
    try {
      //* 1. Check if accessToken haven't to for headers
      const { accessToken } = getInfoHeaders(req.headers);

      const checkEmpty = _.isNull(accessToken) || _.isEmpty(accessToken);
      if (checkEmpty) {
        return next(new UnauthorizedError());
      }

      //* 2 Verify accessToken get info
      const publicKey = req.publicKey;
      const resultAccessToken = verifyToken({
        token: accessToken,
        publicKey,
      });

      //* 3.. If info to token null or empty
      if (_.isEmpty(resultAccessToken) || _.isNull(resultAccessToken)) {
        return next(new UnauthorizedError());
      }

      //* 4. Check if not must is users
      const { role_type } = resultAccessToken;
      const isUser = role_type !== ROLE_TYPE.USER;
      if (isUser) {
        return next(new UnauthorizedError());
      }

      //* 5 Check time expiry of token
      if (isTokenExpired({ exp: resultAccessToken.exp })) {
        return next(new UnauthorizedError(VALIDATE.HAD_EXPIRY));
      }

      //* 6. Save info for request and continue go to logic
      req.infoAccessToken = resultAccessToken;
      return next();
    } catch (_) {
      //* 7. If token verifyToken error mean token is expiry
      return next(new UnauthorizedError(VALIDATE.HAD_EXPIRY));
    }
  }
}
module.exports = AuthMiddleware;
