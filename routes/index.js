// routes/index.js
const router = require("express").Router();
const auth = require("../middlewares/auth");
const {validateCreateUser, validateLogin} = require("../middlewares/validation");

const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");

const { NotFoundError } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");

// ///////////const { getClothingItems } = require("../controllers/clothingItems");

router.post("/signin", validateLogin, login);
router.post("/signup", validateCreateUser, createUser);
// router.get("/items", getClothingItems);

router.use("/items", clothingItemsRouter);

// Protect all routes below this middleware
// ////////////////router.use(auth);
router.use("/users", auth, userRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
