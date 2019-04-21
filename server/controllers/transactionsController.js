import controllerResponse from '../helpers/controllerResponse';
import TransactionsModel from '../models/transactionsModel';

const transactionsModel = new TransactionsModel();

const transactionsController = {
  creditAccount(req, res) {
    try {
      const creditTransaction = transactionsModel.credit(
        req.params.accountNumber,
        req.body,
        req.user,
      );
      controllerResponse.successResponse(res, 201, creditTransaction);
    } catch (error) {
      controllerResponse.errorResponse(res, 400, error);
    }
  },

  deditAccount(req, res) {
    try {
      const debitTransaction = transactionsModel.debit(
        req.params.accountNumber,
        req.body,
        req.user,
      );
      controllerResponse.successResponse(res, 201, debitTransaction);
    } catch (error) {
      controllerResponse.errorResponse(res, 400, error);
    }
  },

  getAll(req, res) {
    try {
      const transactions = transactionsModel.getAll();
      controllerResponse.successResponse(res, 200, transactions);
    } catch (error) {
      controllerResponse.errorResponse(res, 500, error);
    }
  },
};

export default transactionsController;
