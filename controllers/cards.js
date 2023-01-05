const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then(cards => res.status(200).send(cards))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then(card => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка с таким id не найдена' })
      }
      res.status(200).send(card)
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

const createCard = (req, res) => {
  const owner = req.user._id
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then(card => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' })
      }
      res.status(500).send({ message: 'Произошла ошибка' })
    });;
}


const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then(card => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка с таким id не найдена' })
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Невалидный id' })
      }
      res.status(500).send({ message: 'Произошла ошибка' })
    });

}



const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then(card => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка с таким id не найдена' })
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Невалидный id' })
      }
      res.status(500).send({ message: 'Произошла ошибка' })
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
}