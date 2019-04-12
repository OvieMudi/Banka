import usersModel from '../models/usersModel';

const usersController = {
  /**
   * Get all users from database
   * @param {Object} req - server request
   * @param {Object} res - server response
   * @returns {Object} - custom server response with error/success
   */
  getUsers(req, res) {
    try {
      const users = usersModel.getUsers();
      res.status(200).json({
        status: 200,
        data: users,
      });
    } catch (error) {
      res.status(401).json({
        status: 401,
        error,
      });
    }
  },
};

export default usersController;
