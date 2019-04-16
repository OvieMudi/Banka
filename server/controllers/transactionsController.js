import controllerResponse from '../helpers/controllerResponse';
import transactionsModel from '../models/transactionsModel';

const transactionsController = {
  creditAccount(req, res) {
    try {
      const transaction = transactionsModel.credit(req.params.acctNumber, req.body, req.user);
      controllerResponse.successResponse(res, 201, transaction);
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
