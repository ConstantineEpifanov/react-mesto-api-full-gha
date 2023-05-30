const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { handleErrors } = require('./middlewares/handleErrors');
const router = require('./routes/index');

const { PORT = 3000 } = process.env;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(helmet());
app.use(limiter);
app.use(cookieParser());
app.use(express.json());

app.use('/', router);

app.use(errors());
app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`Server is working on PORT ${PORT}!`);
});
