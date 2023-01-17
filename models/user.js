const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'Минимальная длина — 2 символа'],
    maxlength: [30, 'Максимальная длина — 30 символов'],
  },

  email: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Должна быть валидная почта',
    },
    unique: true,
  },

  password: {
    type: String,
    required: true,
    minlength: [8, 'Минимальная длина — 8 символов'],
    select: false,
  },

  about: {
    type: String,
    default: 'Исследователь',
    minlength: [2, 'Минимальная длина — 2 символа'],
    maxlength: [30, 'Максимальная длина — 30 символов'],
  },

  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Должен быть валидный url-адрес',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
