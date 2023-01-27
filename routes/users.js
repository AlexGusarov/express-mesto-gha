const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

const { validateUserUpdate, validateUserID, validateAvatar } = require('../middlewares/validators');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.patch('/me', validateUserUpdate, updateUser);
router.patch('/me/avatar', validateAvatar, updateAvatar);
router.get('/:userId', validateUserID, getUserById);

module.exports = router;
