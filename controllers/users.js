const User = require('../models/user');
const errorCheck = require('./errorCheck');

const getUsers = (req, res) => {
  User.find({})
    .then(users => res.status(200).send(users))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}


const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then(user => res.status(200).send(user))
    .catch(err => {
      console.log(err.name, err.message)
    });
}


const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.status(201).send(user))
    .catch(err => {
      console.log(err.name, err.message)
    });
}


const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name: name }, { about: about }, { new: true })
    .then(user => res.send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}


const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar: avatar }, { new: true })
    .then(user => res.send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}


module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar
}