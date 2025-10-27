const router = require("express").Router();
const {
  createUser,
  updateUser,
  getCurrentUser,
} = require("../controllers/users");

router.post("/", createUser);

router.get("/me", getCurrentUser);

router.patch("/me", updateUser);

module.exports = router;
