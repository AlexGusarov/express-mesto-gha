const BADREQUEST_CODE = 400;
const NOTFOUND_CODE = 404;
const ERROR_CODE = 500;
const OK_CODE = 200;
const CREATE_CODE = 201;

const httpRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

module.exports = {
  BADREQUEST_CODE,
  NOTFOUND_CODE,
  ERROR_CODE,
  OK_CODE,
  CREATE_CODE,
  httpRegex,
};
