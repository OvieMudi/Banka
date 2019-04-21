import UsersModel from '../models/usersModel';
import controllerResponse from '../helpers/controllerResponse';

const usersModel = new UsersModel();

const usersController = {
  /**
   * Get all users from database
   * @param {Object} req - server request
   * @param {Object} res - server response
   * @returns {Object} - custom server response with error/success
   */
  async getUsers(req, res) {
    try {
      const users = await usersModel.getAll();
      controllerResponse.successResponse(res, 200, users);
    } catch (error) {
      controllerResponse.errorResponse(res, 500, error);
    }
  },

  /**
   * Get all users from database
   * @param {Object} req - server request
   * @param {Object} res - server response
   * @returns {Object} - custom server response with error/success
   */
  async getUserById(req, res) {
    try {
      const users = await usersModel.getById(req.params.id);
      controllerResponse.successResponse(res, 200, users);
    } catch (error) {
      controllerResponse.errorResponse(res, 400, error);
    }
  },

  async update(req, res) {
    try {
      const users = await usersModel.update(req.params.id, req.body);
      controllerResponse.successResponse(res, 200, users);
    } catch (error) {
      controllerResponse.errorResponse(res, 400, error);
    }
  },

  async delete(req, res) {
    try {
      await usersModel.delete(req.params.id);
      controllerResponse.messageResponse(res, 200, 'user successfully deleted');
    } catch (error) {
      controllerResponse.errorResponse(res, 404, error);
    }
  },
};

export default usersController;
