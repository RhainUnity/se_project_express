// routes/index.js
const router = require("express").Router();
const { NOT_FOUND_ERROR_CODE } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");
const { getClothingItems } = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");

const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");

router.post("/signin", login);
router.post("/signup", createUser);
router.get("/items", getClothingItems);

// Protect all routes below this middleware
router.use(auth);

router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);

router.use((req, res) => {
  res
    .status(NOT_FOUND_ERROR_CODE)
    .send({ message: "Requested resource not found" });
});

module.exports = router;
