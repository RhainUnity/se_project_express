// clothingItems.js
const router = require("express").Router();
const {
  createClothingItem,
  getClothingItems,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const { validateCreateClothingItem, validateItemId } = require("../middlewares/validation");

router.use(auth);

router.get("/", getClothingItems);

router.post("/", validateCreateClothingItem, createClothingItem);

router.delete("/:itemId", validateItemId, deleteClothingItem);

router.put("/:itemId/likes", validateItemId, likeItem);

router.delete("/:itemId/likes", validateItemId, dislikeItem);
module.exports = router;
