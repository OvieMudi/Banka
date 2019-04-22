const controllerResponse = {
  /**
   * server success response helper
   * @param {Object} res - server response object
   * @param {Object} status - http status code
   * @param {Object} data - data returned in body of response
   * @param {Object} token - JWT token
   * @returns {JSON} res - custom server response
   */
  successResponse(res, status, data, token) {
    return res.status(status).json({
      status,
      token,
      data,
    });
  },

  /**
   * server error response helper
   * @param {Object} res - server response object
   * @param {Object} statusCode - http status code
   * @param {Object} error - error returned in body of response
   * @returns {JSON} res - custom server response
   */
  errorResponse(res, statusCode, error) {
    // eslint-disable-next-line no-console
    console.log(error);
    let status;

    const notFound = error.message.includes('not found');

    if (error.code) {
      if (error.code === '23505' || error.code === 'P0001') {
        error.message = error.detail;
      } else if (error.code === '42601') {
        error.message = 'input cannot be empty';
      }
    }

    if (notFound) {
      status = 404;
    } else {
      status = statusCode;
    }

    return res.status(status).json({
      status,
      error: error.message,
    });
  },

  /**
   * server message response helper
   * @param {Object} res - server response object
   * @param {Object} status - http status code
   * @param {Object} message - message returned in body of response
   * @returns {JSON} res - custom server response
   */
  messageResponse(res, status, message) {
    return res.status(status).json({
      status,
      message,
    });
  },
};

export default controllerResponse;
