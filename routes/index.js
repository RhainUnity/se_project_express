// routes/index.js
const router = require("express").Router();

const auth = require("../middlewares/auth");
const userRouter = require("./users");
const { NotFoundError } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");
const { getClothingItems } = require("../controllers/clothingItems");

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
    .status(NotFoundError)
    .send({ message: "Requested resource not found" });
});

module.exports = router;
