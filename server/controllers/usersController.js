import usersModel from '../models/usersModel';
import controllerResponse from '../helpers/controllerResponse';

const usersController = {
  /**
   * Get all users from database
   * @param {Object} req - server request
   * @param {Object} res - server response
   * @returns {Object} - custom server response with error/success
   */
  getUsers(req, res) {
    try {
      const users = usersModel.getAll();
      controllerResponse.successResponse(res, 200, users);
    } catch (error) {
      controllerResponse.errorResponse(res, 401, error);
    }
  },
};

export default usersController;
