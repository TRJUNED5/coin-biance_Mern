const { ValidationError } = require('joi'); //importing validationerror from joi package to match error from authcontroller

const errorHandler = (error, req, res, next) => {
  // default error
  let status = 500;
  let data = {
    message: 'Internal Server Error',
  };

  if (error instanceof ValidationError) {
    //if error is validation error
    status = 401;
    data.message = error.message;

    return res.status(status).json(data);
  }

  if (error.status) {
    //if error is coming to middleware and if it has status
    status = error.status;
  }

  if (error.message) {
    //if error has message
    data.message = error.message;
  }

  return res.status(status).json(data);
};

module.exports = errorHandler;
