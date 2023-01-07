/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const {
  BADREQUEST_CODE,
  NOTFOUND_CODE,
  ERROR_CODE,
  OK_CODE,
  CREATE_CODE,
} = require('../constants');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK_CODE).send(users))
    .catch(() => res.status(ERROR_CODE).send({ message: 'Произошла ошибка' }));
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOTFOUND_CODE).send({ message: 'Пользователь с указанным id не найден' });
      }
      res.status(OK_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BADREQUEST_CODE).send({ message: 'Невалидный id' });
      }
      res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
    }
    )
    .then((user) => res.status(CREATE_CODE).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BADREQUEST_CODE).send({ message: 'Переданы некорректные данные' });
      }
      res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(NOTFOUND_CODE).send({ message: 'Пользователь с таким id не найден' });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BADREQUEST_CODE).send({ message: 'Переданы некорректные данные' });
      }
      res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(NOTFOUND_CODE).send({ message: 'Пользователь с таким id не найден' });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BADREQUEST_CODE).send({ message: 'Переданы некорректные данные' });
      }
      res.status(ERROR_CODE).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
