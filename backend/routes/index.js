const router = require('express').Router();

const auth = require('../middlewares/auth');
const { validationSignup, validationSignin } = require('../utils/validation');
const { createUser, login } = require('../controllers/users');

const NotFoundError = require('../errors/notFoundError');

const userRouter = require('./users');
const cardRouter = require('./cards');

router.post('/signup', validationSignup, createUser);
router.post('/signin', validationSignin, login);

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);
router.use('/*', auth, (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
