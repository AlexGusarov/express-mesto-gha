const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  console.log('Начинаем мидлвер аутентификации');
  const { authorization } = req.headers;

  let payload;

  try {
    console.log('Начинаем внутри try');

    if (!authorization || !authorization.startWith('Bearer ')) {
      return res.status(401).send({ message: 'Необходима авторизация' });
    }
    const token = authorization.replace('Bearer ', '');
    console.log('Запускаем мидлвер аутентификации');

    console.log('внутри try');
    payload = jwt.verify(
      token,
      'e899105dc15b4e016e69ae003cfb63c0062af09c43b92f0d861177e764810ebc',
    );
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  console.log(payload, 'payload');

  req.user = payload;

  next();
};

module.exports = { auth };
