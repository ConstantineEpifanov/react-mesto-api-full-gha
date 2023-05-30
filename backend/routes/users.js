const userRouter = require('express').Router();
const {
  validationUserId,
  validationUpdateProfile,
  validationUpdateAvatar,
} = require('../utils/validation');

const {
  getUsers,
  getUser,
  getUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/me', getUser);
userRouter.get('/:userId', validationUserId, getUserById);
userRouter.patch('/me', validationUpdateProfile, updateProfile);
userRouter.patch('/me/avatar', validationUpdateAvatar, updateAvatar);

module.exports = userRouter;
