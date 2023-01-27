const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequetError');
const NotFoundError = require('../errors/NotFoundError');
const Forbidden = require('../errors/Forbidden');

const {
  BADREQUEST_CODE,
  NOTFOUND_CODE,
  ERROR_CODE,
  OK_CODE,
  CREATE_CODE,
} = require('../constants');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(OK_CODE).send(cards))
    .catch((err) => next(err));
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return Promise.reject(new NotFoundError('Карточка c таким id не найдена'));
      }

      if (!card.owner.equals(req.user._id)) {
        return Promise.reject(new Forbidden('Можно удалять только свои карточки'));
      }
      card.delete();
      res.status(OK_CODE).send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return Promise.reject(new BadRequestError('Некорректный id карточки'));
      }
      next(err);
    });
};

const createCard = (req, res, next) => {
  console.log('create card');
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => {
      console.log(card, 'card');
      res.status(CREATE_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return Promise.reject(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOTFOUND_CODE).send({ message: 'Карточка с таким id не найдена' });
      }
      res.status(OK_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BADREQUEST_CODE).send({ message: 'Невалидный id' });
      }
      res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOTFOUND_CODE).send({ message: 'Карточка с таким id не найдена' });
      }
      res.status(OK_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BADREQUEST_CODE).send({ message: 'Невалидный id' });
      }
      res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
