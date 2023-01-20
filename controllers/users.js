const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequetError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { OK_CODE, CREATE_CODE } = require('../constants');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(OK_CODE).send(users))
    .catch((err) => next(err));
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotFoundError('Пользователь с таким id не найден'));
      }
      res.status(OK_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return Promise.reject(new BadRequestError('Невалидный id'));
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
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
        return Promise.reject(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotFoundError('Пользователь с таким id не найден'));
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return Promise.reject(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotFoundError('Пользователь с таким id не найден'));
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return Promise.reject(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

const login = async (req, res, next) => {
  try {
    console.log(req.body, 'login');
    const { email, password } = req.body;

    if (!email || !password) {
      throw new UnauthorizedError('Неправильный логин или пароль');
    }

    const user = await User.findOne({ email }).select('+password');
    console.log(user, 'user');

    if (!user) {
      throw new UnauthorizedError('Неправильный логин или пароль');
    } else {
      const matched = await bcrypt.compare(password, user.password);

      if (!matched) {
        throw new UnauthorizedError('Неправильный логин или пароль');
      } else {
        const token = jwt.sign(
          { _id: user._id },
          'e899105dc15b4e016e69ae003cfb63c0062af09c43b92f0d861177e764810ebc',
          { expiresIn: '7d' },
        );
        res.cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        }).end();
      }
    }
  } catch (err) {
    if (err.code === 11000) {
      throw new ConflictError('Пользователь с такой почтой уже зарегистрирован');
    }

    if (err.name === 'ValidatorError') {
      throw new BadRequestError('Что-то не так с почтой или паролем');
    }

    next(err);
  }
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotFoundError('Пользователь с таким id не найден'));
      }
      res.send(user);
    })
    .catch((err) => next(err));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getUserInfo,
};
