const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: "You must enter a valid email address",
    },
  },
  password: { type: String, required: true, select: false },
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: validator.isURL,
      message: "You must enter a valid URL",
    },
  },
});

// Add a custom static to verify credentials ///////////
userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  // trying to find the user by email
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      // not found - reject
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      // compare hashes and resolve with user if matched
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
