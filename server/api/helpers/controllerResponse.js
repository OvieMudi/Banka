const controllerResponse = {
  successResponse(res = {}, status = 200, data = {}) {
    return res.status(status).json({
      status,
      data,
    });
  },

  errorResponse(res = {}, statusCode = 400, error = '' || {}) {
    let status;
    if (typeof error === 'object') {
      // eslint-disable-next-line no-console
      console.log(error);
      status = error.message.includes('not found') ? 404 : statusCode;
      return res.status(status).json({
        status,
        error: error.message,
      });
    }
    status = error.includes('not found') ? 404 : statusCode;
    return res.status(status).json({
      status,
      error,
    });
  },

  messageResponse(res = {}, status = 200, message = '') {
    return res.status(status).json({
      status,
      message,
    });
  },
};

export default controllerResponse;
