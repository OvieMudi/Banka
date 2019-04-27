import express from 'express';
import usersController from '../controllers/usersController';
import auth from '../middleware/authenticator';
import validator from '../middleware/requestValidator';

const usersRouter = express.Router();

usersRouter.route('/').get(auth.verifyAuth, auth.verifyStaff, usersController.getUsers);

usersRouter
  .route('/:id')
  .get(auth.verifyAuth, auth.verifyClientAndStaff, usersController.getUserById)
  .patch(
    validator.validateUserUpdate,
    validator.validateIdParams,
    auth.verifyAuth,
    auth.verifyAdmin,
    usersController.update,
  )
  .delete(auth.verifyAuth, auth.verifyAdmin, validator.validateIdParams, usersController.delete);

export default usersRouter;
