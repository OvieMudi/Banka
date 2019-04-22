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
  async create(req, res) {
    try {
      const { user } = req;
      const account = await accountsModel.create(req.body);
      const response = {
        accountNumber: account.accountNumber,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        othername: user.othername,
        type: account.type,
        openingBalance: account.balance,
      };
      controllerResponse.successResponse(res, 201, response);
    } catch (error) {
      controllerResponse.errorResponse(res, 400, error);
    }
  },

  /**
   * Gets all bank accounts
   * @param {Object} req - Server request
   * @param {Object} res - custom server response
   * @returns {null} -
   */
  async getAll(req, res) {
    try {
      const accounts = await accountsModel.getAll();
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
  async updateAccount(req, res) {
    try {
      const account = await accountsModel.findAndUpdate(
        'accountNumber',
        req.params.accountNumber,
        req.body,
      );
      controllerResponse.successResponse(res, 200, account);
    } catch (error) {
      controllerResponse.errorResponse(res, 400, error);
    }
  },

  async delete(req, res) {
    try {
      await accountsModel.findAndDelete('accountNumber', req.params.accountNumber);
      controllerResponse.messageResponse(res, 200, 'account deleted successfully');
    } catch (error) {
      controllerResponse.errorResponse(res, 400, error);
    }
  },
};

export default accountsController;
