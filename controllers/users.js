const User = require('../models/user');
const express = require('express');
const bodyParser = require('body-parser');


const getUsers = (req, res) => {
  User.find({})
    .then(users => res.status(200).send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

const getUserById = (req, res) => {

  const { id } = req.params
  User.findById(id)
    .then(user => res.status(200).send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  console.log('body in createUser', req.body)

  User.create({ name, about, avatar })
    .then(user => res.status(201).send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.exports = {
  getUsers,
  getUserById,
  createUser
}