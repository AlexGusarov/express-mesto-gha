const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const { PORT = 3000, BASE_PATH } = process.env;

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
// app.use('/users', require('./routes/users'));
app.post('/users', (req, res) => {
  res.send(req.body);
})


async function connect() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
  });
  console.log(`Server connecting to Mongo`)

  await app.listen(PORT);
  console.log(`Server listening ${PORT}`)
}

connect();


