const router = require('express').Router();

const { login } = require('../controllers/users');

const { validateUserLogin } = require('../middlewares/validators');

router.post('/', validateUserLogin, login);

module.exports = router;
