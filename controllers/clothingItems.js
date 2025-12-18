// controllers/clothingItems.js
const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require("../utils/errors");
// const errorHandler = require("../middlewares/errorHandler");

// GET /items
const getClothingItems = (req, res, next) =>
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(next); 
    

// POST /items
const createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  if (!owner) {
    return next(new BadRequestError("Owner information is missing"));
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
        return next(new BadRequestError("Invalid data provided for clothing item"));
      }
      return next(err); 
    });
};

// DELETE /items/:itemId
const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  const owner = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid item ID"));
  }

  return ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Clothing item not found"));
      }
      if (item.owner.toString() !== owner) {
        throw new ForbiddenError("You do not have permission to delete this item");
      }
      return ClothingItem.findByIdAndDelete(itemId).then((deleted) =>
        res
          .status(200)
          .send({ message: "Item deleted successfully", item: deleted })
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      return next(err);
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid item ID"));
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array
    { new: true }
  )
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      res.send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      return next(err);
    });
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid item ID"));
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .then((item) => {
      if (!item) {
        throw new NotFoundError('Item not found');
      }

      res.send(item);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid item ID'));
      }
      return next(err);
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
