const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const {
  INTERNAL_SERVER_ERROR_CODE,
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  FORBIDDEN_ERROR_CODE,
} = require("../utils/errors");

// GET /items
const getClothingItems = (req, res) =>
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(() =>
      res.status(INTERNAL_SERVER_ERROR_CODE).send({
        message: "An error has occurred on the server",
      })
    );

// POST /items
const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  if (!owner) {
    return res
      .status(BAD_REQUEST_ERROR_CODE)
      .send({ message: "Owner is required to create an item" });
  }

  return ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner,
  })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Invalid item data" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

// DELETE /items/:itemId
const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  const owner = req.user._id;
  if (!owner) {
    return res
      .status(FORBIDDEN_ERROR_CODE)
      .send({ message: "Owner is required to delete an item" });
  }
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res
      .status(FORBIDDEN_ERROR_CODE) // Changed to 403 Forbidden
      .send({ message: "Invalid item ID" });
  }

  return ClothingItem.findByIdAndDelete(itemId)
    .then((item) =>
      item
        ? res.status(200).send({ message: "Item deleted successfully", item })
        : res.status(NOT_FOUND_ERROR_CODE).send({ message: "Item not found" })
    )
    .catch(() =>
      res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "Error deleting item" })
    );
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res
      .status(BAD_REQUEST_ERROR_CODE)
      .send({ message: "Invalid item ID" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .then((item) =>
      item
        ? res.status(200).send(item)
        : res.status(NOT_FOUND_ERROR_CODE).send({ message: "Item not found" })
    )
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Invalid item ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res
      .status(BAD_REQUEST_ERROR_CODE)
      .send({ message: "Invalid item ID" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .then((item) =>
      item
        ? res.status(200).send(item)
        : res.status(NOT_FOUND_ERROR_CODE).send({ message: "Item not found" })
    )
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Invalid item ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
