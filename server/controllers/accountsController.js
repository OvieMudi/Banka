import AccountsModel from '../models/accountsModel';
import controllerResponse from '../helpers/controllerResponse';
import TransactionsModel from '../models/transactionsModel';
import UsersModel from '../models/usersModel';

const usersModel = new UsersModel();

const transactionsModel = new TransactionsModel();

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
      const user = await usersModel.getById(req.user.id);
      req.body.owner = user.id;

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
   * @returns {Object} -
   */
  async getAll(req, res) {
    if (req.query.status === 'active') {
      try {
        const { rows: accounts } = await accountsModel.searchDatabase('status', 'active');
        controllerResponse.successResponse(res, 200, accounts);
      } catch (error) {
        controllerResponse.errorResponse(res, 500, error);
      }
    } else if (req.query.status === 'dormant') {
      try {
        const { rows: accounts } = await accountsModel.searchDatabase('status', 'dormant');
        controllerResponse.successResponse(res, 200, accounts);
      } catch (error) {
        controllerResponse.errorResponse(res, 500, error);
      }
    } else {
      try {
        const accounts = await accountsModel.getAll();
        controllerResponse.successResponse(res, 200, accounts);
      } catch (error) {
        controllerResponse.errorResponse(res, 500, error);
      }
    }
  },

  /**
   * Gets single bank account
   * @param {Object} req - Server request
   * @param {Object} res - custom server response
   * @returns {Object} - Success or error response
   */
  async getByAccountNumber(req, res) {
    try {
      const accounts = await accountsModel.getByAccountNumber(req.params.accountNumber);
      controllerResponse.successResponse(res, 200, accounts);
    } catch (error) {
      controllerResponse.errorResponse(res, 500, error);
    }
  },

  /**
   * Gets all bank accounts of an email
   * @param {Object} req - Server request
   * @param {Object} res - custom server response
   * @returns {Object} -
   */
  async getAllByEmail(req, res) {
    try {
      const accounts = await accountsModel.getAllByEmail(req.params.userEmail);
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

  /**
   * Gets  transaction history of a bank account
   * @param {Object} req - Server request
   * @param {Object} res - custom server response
   * @returns {null} -
   */
  async getAccountHistory(req, res) {
    try {
      const { rows: transactions } = await transactionsModel.searchDatabase(
        'accountNumber',
        req.params.accountNumber,
      );
      controllerResponse.successResponse(res, 200, transactions);
    } catch (error) {
      controllerResponse.errorResponse(res, 404, error);
    }
  },

  /**
   * deletes a bank account
   * @param {Object} req - Server request
   * @param {Object} res - custom server response
   * @returns {null} -
   */
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
