// auth.js
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UnauthorizedError } = require("../utils/errors");

module.exports = (req, res, next) => {
  // shortcut to get token from header for DEV purposes!!! //
  // /////////
  if (process.env.NODE_ENV === "alpha-development") {
    // Skip auth entirely in dev
    req.user = { _id: "6729aa7d39d7e0f1dc123456" };
    return next();
  }

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authorization required"));
  }
  const token = authorization.replace("Bearer ", "");

  try {
    req.user = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError("Authorization required"));
  }

  return next();
};
