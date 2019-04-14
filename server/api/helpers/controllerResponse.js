const controllerResponse = {
  successResponse(res = {}, status = 200, data = {}) {
    return res.status(status).json({
      status,
      data,
    });
  },

  errorResponse(res = {}, status = 400, error = '' || {}) {
    if (typeof error === 'object') {
      // eslint-disable-next-line no-console
      console.log(error);
      return res.status(status).json({
        status,
        error: error.message,
      });
    }
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
