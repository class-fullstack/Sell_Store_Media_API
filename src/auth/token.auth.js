//* LIB
const jwt = require("jsonwebtoken");

class TokenAuth {
  verifyToken({ token, publicKey }) {
    return jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
    });
  }
}
module.exports = new TokenAuth();
