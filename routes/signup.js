const router = require('express').Router();

const { createUser } = require('../controllers/users');

router.use('/', createUser);

module.exports = router;
