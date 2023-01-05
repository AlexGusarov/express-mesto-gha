/* eslint-disable consistent-return */
const Card = require('../models/card');

const {
  BADREQUEST_CODE,
  NOTFOUND_CODE,
  ERROR_CODE,
  OK_CODE,
  CREATE_CODE,
} = require('../constants');

const getCards = (req, res) => {
  console.log(OK_CODE);
  Card.find({})
    .then((cards) => res.status(OK_CODE).send(cards))
    .catch(() => res.status(ERROR_CODE).send({ message: 'Произошла ошибка' }));
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        return res.status(NOTFOUND_CODE).send({ message: 'Карточка с таким id не найдена' });
      }
      res.status(OK_CODE).send(card);
    })
    .catch(() => res.status(ERROR_CODE).send({ message: 'Произошла ошибка' }));
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(CREATE_CODE).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BADREQUEST_CODE).send({ message: 'Переданы некорректные данные' });
      }
      res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
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
    .populate(['owner', 'likes'])
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
