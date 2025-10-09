const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");

// GET /items
const getClothingItems = (req, res) => {
  return ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      // console.error(err);
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID", error: err });
      }
      return res
        .status(500)
        .send({ message: "Error retrieving items", error: err });
    });
};

// POST /items
const createClothingItem = (req, res) => {
  const { name, weather, imageUrl, likes, createdAt } = req.body;
  // prefer the authenticated user id; fallback to owner in request body
  const owner = (req.user && req.user._id) || req.body.owner;

  if (!owner) {
    return res
      .status(400)
      .send({ message: "Owner is required to create an item" });
  }

  return ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner,
    likes,
    createdAt,
  })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      // console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Invalid item data", error: err });
      }
      return res
        .status(500)
        .send({ message: "Error creating item", error: err });
    });
};

// DELETE /items/:itemId
const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).send({ message: "Invalid item ID" });
  }

  return ClothingItem.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      return res
        .status(200)
        .send({ message: "Item deleted successfully", item });
    })
    .catch((err) => {
      // console.error(err);
      return res
        .status(500)
        .send({ message: "Error deleting item", error: err });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).send({ message: "Invalid item ID" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      return res.status(200).send(item);
    })
    .catch((err) => {
      // console.error(err);
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID", error: err });
      }
      return res.status(500).send({ message: "Error liking item", error: err });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).send({ message: "Invalid item ID" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      return res.status(200).send(item);
    })
    .catch((err) => {
      // console.error(err);
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID", error: err });
      }
      return res
        .status(500)
        .send({ message: "Error unliking item", error: err });
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
