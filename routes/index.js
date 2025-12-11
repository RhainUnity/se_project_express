// routes/index.js
const router = require("express").Router();

const auth = require("../middlewares/auth");
const {validateCreateUser, validateLogin} = require("../middlewares/validation");
const userRouter = require("./users");
const { NotFoundError } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");
const { getClothingItems } = require("../controllers/clothingItems");

const clothingItemsRouter = require("./clothingItems");

router.post("/signin", validateLogin, login);
router.post("/signup", validateCreateUser, createUser);
// router.get("/items", getClothingItems);

// Protect all routes below this middleware
router.use(auth);

router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
