const router = require('express').Router();

const { createUser } = require('../controllers/users');

const { validateUserAuth } = require('../middlewares/validators');

router.post('/', validateUserAuth, createUser);

module.exports = router;
