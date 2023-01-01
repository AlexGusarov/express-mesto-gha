const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bodyParser = require('body-parser');
const { getUsers, createUser, getUserById } = require('../controllers/users')
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.get('/', getUsers);

router.get('/:userId', getUserById)

router.post('/', express.json(), createUser);

module.exports = router;
