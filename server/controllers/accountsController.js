import AccountsModel from '../models/accountsModel';
import controllerResponse from '../helpers/controllerResponse';

const accountsModel = new AccountsModel();

const accountsController = {
  /**
   * Creates a new bank account
   * @param {Object} req - Server request
   * @param {Object} res - custom server response
   * @returns {null} -
   */
  create(req, res) {
    try {
      const account = accountsModel.create(req.body, req.user);
      controllerResponse.successResponse(res, 201, account);
    } catch (error) {
      controllerResponse.errorResponse(res, 400, error.message);
    }
  },

  /**
   * Gets all bank accounts
   * @param {Object} req - Server request
   * @param {Object} res - custom server response
   * @returns {null} -
   */
  getAll(req, res) {
    try {
      const accounts = accountsModel.getAll();
      controllerResponse.successResponse(res, 200, accounts);
    } catch (error) {
      controllerResponse.errorResponse(res, 500, error);
    }
  },

  /**
   * Activate or deactivates a bank account
   * @param {Object} req - Server request
   * @param {Object} res - custom server response
   * @returns {null} -
   */
  changeAcctStatus(req, res) {
    try {
      const account = accountsModel.changeStatus(req.params.accountNumber, req.body, req.user);
      controllerResponse.successResponse(res, 200, account);
    } catch (error) {
      controllerResponse.errorResponse(res, 400, error);
    }
  },

  delete(req, res) {
    try {
      const deleted = accountsModel.deleteByAcctNo(req.params.accountNumber, req.user);
      controllerResponse.messageResponse(res, 200, deleted);
    } catch (error) {
      controllerResponse.errorResponse(res, 400, error);
    }
  },
};

export default accountsController;
