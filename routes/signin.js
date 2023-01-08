const router = require('express').Router();

const { login } = require('../controllers/users');

router.use('/', login);

module.exports = router;
