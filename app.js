const path = require('path');
const express = require('express');
const mongoose = require('mongoose');


const app = express();
const { PORT = 3000 } = process.env;


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded());
app.use((req, res, next) => {
  req.user = {
    _id: '63b32a890ab5f7bf976a2edc'
  };
  next();
});
app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));


mongoose.set('strictQuery', false);


async function connect() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
  });
  console.log(`Server connected to Mongo`)

  await app.listen(PORT);
  console.log(`Server listening ${PORT}`)
}

connect();

