import controllerResponse from '../helpers/controllerResponse';
import TransactionsModel from '../models/transactionsModel';
import AccountsModel from '../models/accountsModel';

const transactionsModel = new TransactionsModel();
const accountsModel = new AccountsModel();

const transactionsController = {
  async credit(req, res) {
    try {
      const creditTransaction = await transactionsModel.credit(
        req.params.accountNumber,
        req.body.amount,
        req.user.id,
      );
      controllerResponse.successResponse(res, 201, creditTransaction);
    } catch (error) {
      controllerResponse.errorResponse(res, 400, error);
    }
  },

  async debit(req, res) {
    try {
      const debitTransaction = await transactionsModel.debit(
        req.params.accountNumber,
        req.body.amount,
        req.user.id,
      );
      controllerResponse.successResponse(res, 201, debitTransaction);
    } catch (error) {
      controllerResponse.errorResponse(res, 400, error);
    }
  },

  async getAll(req, res) {
    try {
      const transactions = await transactionsModel.getAll();
      controllerResponse.successResponse(res, 200, transactions);
    } catch (error) {
      controllerResponse.errorResponse(res, 500, error);
    }
  },

  async getById(req, res) {
    try {
      const transaction = await transactionsModel.getById(req.params.transactionId);
      if (transaction) {
        const { accountNumber } = transaction;
        const account = await accountsModel.getByAccountNumber(accountNumber);
        if (account.owner === req.user.id || req.user.type === 'cashier') {
          controllerResponse.successResponse(res, 200, transaction);
        } else {
          controllerResponse.errorResponse(
            res,
            403,
            new Error('unauthorized to access this resource'),
          );
        }
      } else {
        controllerResponse.errorResponse(res, 404, new Error('transaction not found'));
      }
    } catch (error) {
      controllerResponse.errorResponse(res, 500, error);
    }
  },
};

export default transactionsController;
