// controllers/users.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
  ConflictError,
} = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

// GET /users/me
const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  return User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID"));
      }
      return next(err);
    });
};

// POST / create users
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password || !name || !avatar) {
    return next(new BadRequestError("All fields are required"));
  }

  return bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        email,
        password: hash,
        name,
        avatar,
      })
    )
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      res.status(201).send(userObj);
    })
    .catch((err) => {
      if (err && err.code === 11000) {
        return next(new ConflictError("Email already in use"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid user data"));
      }
      return next(err);
    });
};

// POST /signin
const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Incorrect email or password"));
      }
      return next(err);
    });
};

// PATCH /users/me - update user profile
const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  return User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send(user)) // 200 OK
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid user data"));
      }
      return next(err);
    });
};

module.exports = { createUser, getCurrentUser, login, updateUser };
