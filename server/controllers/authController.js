import authHelper from '../helpers/authHelper';
import UsersModel from '../models/usersModel';
import controllerResponse from '../helpers/controllerResponse';

const usersModel = new UsersModel();

const authController = {
  /**
   * User sign up handler
   * @param {Object} req - server request object
   * @param {Object} res - server response object
   * @returns {JSON} res - custom server response
   */
  async signUp(req, res) {
    try {
      const user = await usersModel.create(req.body);
      const token = authHelper.generateToken(user);
      controllerResponse.successResponse(res, 201, user, token);
    } catch (error) {
      controllerResponse.errorResponse(res, 400, error);
    }
  },

  /**
   * User sign in handler
   * @param {Object} req - server request object
   * @param {Object} res - server response object
   * @returns {JSON} res - custom server response
   */
  async signIn(req, res) {
    try {
      const user = await usersModel.signIn(req.body);
      const token = authHelper.generateToken(user);
      controllerResponse.successResponse(res, 200, user, token);
    } catch (error) {
      controllerResponse.errorResponse(res, 400, error);
    }
  },
};

export default authController;
