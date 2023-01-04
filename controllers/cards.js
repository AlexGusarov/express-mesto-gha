const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then(cards => res.status(200).send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then(card => res.status(200).send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

const createCard = (req, res) => {
  const owner = req.user._id
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then(card => res.status(201).send(card))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}


const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
}

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
}