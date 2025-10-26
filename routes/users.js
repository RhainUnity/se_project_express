const router = require("express").Router();
const {
  getUsers,
  createUser,
  getCurrentUser,
  updateUser,
} = require("../controllers/users");

router.get("/", getUsers);

router.get("/me", getCurrentUser);

router.post("/", createUser);

router.patch("/me", updateUser);

module.exports = router;
