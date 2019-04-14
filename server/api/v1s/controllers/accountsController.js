import accountsModel from '../models/accountsModel';
import controllerResponse from '../../helpers/controllerResponse';

const accountsController = {
  create(req, res) {
    try {
      const account = accountsModel.create(req.body, req.user);
      controllerResponse.successResponse(res, 201, account);
    } catch (error) {
      controllerResponse.errorResponse(res, 400, error.message);
    }
  },

  getAll(req, res) {
    try {
      const accounts = accountsModel.getAll();
      controllerResponse.successResponse(res, 200, accounts);
    } catch (error) {
      controllerResponse.errorResponse(res, 500, error);
    }
  },
};

export default accountsController;
