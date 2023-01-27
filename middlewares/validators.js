const { celebrate, Joi } = require('celebrate');
const { httpRegex } = require('../constants');

const validateCreatingCard = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().regex(httpRegex),
    })
    .unknown(),
});

const validateCardId = celebrate({
  params: Joi.object()
    .keys({
      cardId: Joi.string().required().hex(),
    })
    .unknown(),
});

const validateUserAuth = celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(httpRegex),
    })
    .unknown(),
});

const validateUserLogin = celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    })
    .unknown(),
});

const validateUserUpdate = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    })
    .unknown(),
});

const validateUserID = celebrate({
  params: Joi.object()
    .keys({
      userId: Joi.string().hex().required(),
    })
    .unknown(),
});

const validateAvatar = celebrate({
  body: Joi.object()
    .keys({
      avatar: Joi.string().regex(httpRegex),
    })
    .unknown(),
});

module.exports = {
  validateCreatingCard,
  validateCardId,
  validateUserAuth,
  validateUserLogin,
  validateUserUpdate,
  validateUserID,
  validateAvatar,
};
