const errorCheck = (errorName, ERROR_CODE, errorMessage) => {
  if (err.name === errorName) {
    return res.status(ERROR_CODE).send({ message: errorMessage });
  } else {
    res.status(500).send({ message: 'Произошла ошибка' })
  }
}

module.exports = errorCheck;