import jwt from 'jsonwebtoken';
import controllerResponse from '../helpers/controllerResponse';
import usersModel from '../v1s/models/usersModel';

const authenticateReq = {
  verifyAuth(req, res, next) {
    let token = req.headers['x-access-token'] || req.headers.authorization || '';
    if (token.startsWith('Bearer')) token = token.slice(7, token.length);
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.SECRET_STRING);
        const user = usersModel.getById(decoded.userId);
        if (user) {
          req.user = { id: decoded.userId, isAdmin: decoded.isAdmin };
          next();
        } else controllerResponse.errorResponse(res, 404, 'user not found');
      } catch (err) {
        controllerResponse.errorResponse(res, 400, err.message);
      }
    } else {
      controllerResponse.errorResponse(res, 400, 'token not provided');
    }
  },
};

export default authenticateReq;
