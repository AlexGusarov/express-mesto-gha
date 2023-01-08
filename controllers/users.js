/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
      });
    })
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

const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Что-то не так с паролем или с почтой'));
      }
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
    })
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'e899105dc15b4e016e69ae003cfb63c0062af09c43b92f0d861177e764810ebc',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      }).end();
    })
    .catch();
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
