import authHelper from '../../../helpers/authHelper';
import usersModel from '../models/usersModel';

const authController = {
  /**
   * User sign up handler
   * @param {Object} req - server request object
   * @param {Object} res - server response object
   * @returns {JSON} res - custom server response
   */
  signUp(req, res) {
    try {
      const user = usersModel.create(req.body);
      const token = authHelper.generateToken(user);
      res.status(201).json({
        status: 201,
        token,
        data: user,
      });
    } catch (error) {
      returnError(400, error, res);
    }
  },

  /**
   * User sign in handler
   * @param {Object} req - server request object
   * @param {Object} res - server response object
   * @returns {JSON} res - custom server response
   */
  signIn(req, res) {
    try {
      const user = usersModel.signIn(req.body);
      const token = authHelper.generateToken(user);
      res.status(200).json({
        status: 200,
        token,
        data: user,
      });
    } catch (error) {
      returnError(400, error, res);
    }
  },
};

/**
 *
 * @param {Number} errorCode - error code
 * @param {Object} error - error Object
 * @param {Object} res - res object
 * @returns {JSON} res - a custum res object
 */
function returnError(errorCode = 400, error, res) {
  // eslint-disable-next-line no-console
  console.log(error);
  return res.status(errorCode).json({
    status: errorCode,
    error: error.message,
  });
}

export default authController;
