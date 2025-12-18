const { Joi, celebrate } = require('celebrate');

const validateCreateClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),   
    weather: Joi.string().required().valid('hot', 'warm', 'cold'),
    imageUrl: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().required().min(2).max(30),
    avatar: Joi.string().uri({ scheme: ['http', 'https']}).
    required(),
  }),
});

const validateLogin = celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
    }),
});

const validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required(),
  }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  validateCreateClothingItem,
  validateCreateUser,
  validateLogin,
    validateItemId,
    validateUserId,
};