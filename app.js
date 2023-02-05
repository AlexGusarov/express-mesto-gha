const express = require('express');

const mongoose = require('mongoose');

const process = require('process');

const { errors } = require('celebrate');

const rateLimit = require('express-rate-limit');

const helmet = require('helmet');

const cors = require('cors');

const { PORT = 3000 } = process.env;

const NotFoundError = require('./errors/NotFoundError');

const { auth } = require('./middlewares/auth');

const errorsHandler = require('./middlewares/errorsHandler');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();

app.use(cors());

app.use(limiter);

app.use(helmet());

app.use(express.json());

app.use('/signin', require('./routes/signin'));

app.use('/signup', require('./routes/signup'));

app.use('/cards', auth, require('./routes/cards'));

app.use('/users', auth, require('./routes/users'));

app.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
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
