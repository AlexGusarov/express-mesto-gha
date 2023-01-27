const express = require('express');

const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');

const process = require('process');

const { errors } = require('celebrate');

const rateLimit = require('express-rate-limit');

const app = express();

const { PORT = 3000 } = process.env;

const { NOTFOUND_CODE } = require('./constants');

const { auth } = require('./middlewares/auth');

const errorsHandler = require('./middlewares/errorsHandler');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cookieParser());

app.use(express.json());

app.use('/signin', require('./routes/signin'));

app.use('/signup', require('./routes/signup'));

app.use('/cards', auth, require('./routes/cards'));

app.use('/users', auth, require('./routes/users'));

app.use('*', (req, res) => {
  res.status(NOTFOUND_CODE).send({ message: 'Страница не найдена' });
});

mongoose.set('strictQuery', false);

async function connect() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestodb', {
      useNewUrlParser: true,
    });
    console.log('Server connected to Mongo');

    await app.listen(PORT);
    console.log(`Server listening ${PORT}`);
  } catch (err) {
    console.log(`Произошла ошибка ${err.name} - ${err.message}`);
  }
}

connect();

app.use(errors());

app.use(errorsHandler);
