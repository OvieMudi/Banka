import jwt from 'jsonwebtoken';
import controllerResponse from '../helpers/controllerResponse';
import UsersModel from '../models/usersModel';
import AccountsModel from '../models/accountsModel';

const usersModel = new UsersModel();
const accountsModel = new AccountsModel();

const unauthorized = new Error('unauthorized to access this resource');

const authenticator = {
  async verifyAuth(req, res, next) {
    let token = req.headers['x-access-token'] || req.headers.authorization || '';
    if (token.startsWith('Bearer')) token = token.slice(7, token.length);
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.SECRET_STRING);
        const user = await usersModel.getById(decoded.id);
        if (user) {
          req.user = {
            id: user.id,
            type: user.type,
          };
          next();
        } else controllerResponse.errorResponse(res, 404, new Error('user not found'));
      } catch (error) {
        controllerResponse.errorResponse(res, 401, error);
      }
    } else {
      controllerResponse.errorResponse(res, 401, new Error('token not provided'));
    }
  },

  async verifyAdmin(req, res, next) {
    const { user } = req;
    if (user.type === 'admin') {
      next();
    } else {
      controllerResponse.errorResponse(res, 403, unauthorized);
    }
  },

  async verifyCashier(req, res, next) {
    const { user } = req;
    if (user.type === 'cashier') {
      next();
    } else {
      controllerResponse.errorResponse(res, 403, unauthorized);
    }
  },

  async verifyStaff(req, res, next) {
    const { user } = req;
    if (user.type === 'admin' || user.type === 'cashier') {
      next();
    } else {
      controllerResponse.errorResponse(res, 403, unauthorized);
    }
  },

  async verifyClient(req, res, next) {
    const { user } = req;
    if (user.type === 'client') {
      next();
    } else {
      controllerResponse.errorResponse(res, 403, unauthorized);
    }
  },

  async verifyAccountOwner(req, res, next) {
    try {
      const account = await accountsModel.getByAccountNumber(req.params.accountNumber);
      if (req.user.id === account.owner || req.user.type === 'cashier') {
        next();
      } else {
        controllerResponse.errorResponse(res, 403, unauthorized);
      }
    } catch (error) {
      controllerResponse.errorResponse(res, 400, error);
    }
  },
};

export default authenticator;
