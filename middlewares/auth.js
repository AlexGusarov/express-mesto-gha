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
    console.log(token, 'token');
    payload = jwt.verify(token, 'top-secret');

    console.log(payload, 'payload');
  } catch (err) {
    console.log(payload, 'payload2');
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};

module.exports = { auth };
