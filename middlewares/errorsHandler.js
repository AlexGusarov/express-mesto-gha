const errorsHandler = (err, req, res, next) => {
  console.log('Запускаем обработчик ошибок');
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
};

module.exports = errorsHandler;
