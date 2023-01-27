const { celebrate, Joi } = require('celebrate');

const httpRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

const validateCreatingCard = () => {
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().required().min(2).max(30),
        link: Joi.string().required(),
      })
      .unknown(),
  });
};

const validateCardId = () => {
  celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.string().required(),
      })
      .unknown(),
  });
};

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
      userId: Joi.string().guid().required(),
    })
    .unknown(),
});

const validateAvatar = celebrate({
  body: Joi.object()
    .keys({
      avatar: Joi.string().required(),
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
