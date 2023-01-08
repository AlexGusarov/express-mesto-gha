const express = require('express');

const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');

const process = require('process');

const app = express();

const { PORT = 3000 } = process.env;

const { NOTFOUND_CODE } = require('./constants');

app.use(cookieParser());

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '63b32a890ab5f7bf976a2edc',
  };
  next();
});

app.use('/cards', require('./routes/cards'));

app.use('/users', require('./routes/users'));

app.post('/signin', require('./routes/signin'));

app.post('/signup', require('./routes/signup'));

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
