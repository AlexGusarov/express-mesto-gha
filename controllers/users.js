const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then(users => res.status(200).send(users))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}


const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь с указанным id не найден' })
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Невалидный id' })
      }
      res.status(500).send({ message: 'Произошла ошибка' })
    });
}


const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' })
      }
      res.status(500).send({ message: 'Произошла ошибка' })
    });

}


const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь с таким id не найден' })
      }
      res.send(user)
    })
    .catch((err) => {
      console.log(err.name)
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' })
      }

      res.status(500).send({ message: 'Произошла ошибка' })
    });
}


const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar: avatar }, { new: true, runValidators: true })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь с таким id не найден' })
      }
      res.send(user)
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' })
      }
      res.status(500).send({ message: 'Произошла ошибка' })
    });
}


module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar
}