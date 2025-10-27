const router = require("express").Router();
const { getUsers, createUser, updateUser } = require("../controllers/users");

router.post("/", createUser);

router.patch("/me", updateUser);

module.exports = router;
