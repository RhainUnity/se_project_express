const User = require("../models/user");

// GET /users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Error retrieving users", error: err });
    });
};

// GET /users/:userId
const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      res.send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid user ID", error: err });
      }
      res.status(500).send({ message: "Error retrieving user", error: err });
    });
};

// POST /users
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Invalid user data", error: err });
      }
      res.status(500).send({ message: "Error creating user", error: err });
    });
};

module.exports = { getUsers, createUser, getUserById };
