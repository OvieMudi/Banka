import jwt from 'jsonwebtoken';
import controllerResponse from '../helpers/controllerResponse';
import UsersModel from '../models/usersModel';

const usersModel = new UsersModel();

const authenticator = {
  async verifyAuth(req, res, next) {
    let token = req.headers['x-access-token'] || req.headers.authorization || '';
    if (token.startsWith('Bearer')) token = token.slice(7, token.length);
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.SECRET_STRING);
        const user = await usersModel.getById(decoded.userId);
        if (user) {
          req.user = { id: user.id, type: user.type };
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
      controllerResponse.errorResponse(
        res,
        403,
        new Error('not authorized to access this resource'),
      );
    }
  },

  async verifyCashier(req, res, next) {
    const { user } = req;
    if (user.type === 'cashier') {
      next();
    } else {
      controllerResponse.errorResponse(
        res,
        403,
        new Error('not authorized to access this resource'),
      );
    }
  },

  async verifyStaff(req, res, next) {
    const { user } = req;
    if (user.type === 'admin' || user.type === 'cashier') {
      next();
    } else {
      controllerResponse.errorResponse(
        res,
        403,
        new Error('not authorized to access this resource'),
      );
    }
  },
};

export default authenticator;
