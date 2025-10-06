const clothingItem = require("../models/clothingItem");

// GET /items
const getClothingItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.send(items))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID", error: err });
      }
      console.error(err);
      res.status(500).send({ message: "Error retrieving items", error: err });
    });
};

// POST /items
const createClothingItem = (req, res) => {
  const { name, weather, imageUrl, owner, likes, createdAt } = req.body;
  clothingItem
    .create({ name, weather, imageUrl, owner, likes, createdAt })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Invalid item data", error: err });
      }
      res.status(500).send({ message: "Error creating item", error: err });
    });
};

// DELETE /items/:itemId
const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  clothingItem
    .findByIdAndRemove(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      return res.send({ message: "Item deleted successfully", item });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Error deleting item", error: err });
    });
};

module.exports = { getClothingItems, createClothingItem, deleteClothingItem };
