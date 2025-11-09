const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED_ERROR_CODE } = require("../utils/errors");

module.exports = (req, res, next) => {
  // shortcut to get token from header for DEV purposes!!! //
  // /////////
  if (process.env.NODE_ENV === "development") {
    // Skip auth entirely in dev
    req.user = { _id: "6729aa7d39d7e0f1dc123456" }; // <- use a valid ObjectId from your DB if possible
    return next();
  }

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(UNAUTHORIZED_ERROR_CODE)
      .send({ message: "Authorization required" });
  }
  const token = authorization.replace("Bearer ", "");

  try {
    req.user = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(UNAUTHORIZED_ERROR_CODE)
      .send({ message: "Authorization required" });
  }

  return next();
};
