import controllerResponse from '../helpers/controllerResponse';
import TransactionsModel from '../models/transactionsModel';

const transactionsModel = new TransactionsModel();

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
};

export default transactionsController;
