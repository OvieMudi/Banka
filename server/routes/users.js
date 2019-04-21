import express from 'express';
import usersController from '../controllers/usersController';
import authenticator from '../middleware/authenticator';
import validator from '../middleware/requestValidator';

const usersRouter = express.Router();

usersRouter
  .route('/')
  .get(authenticator.verifyAuth, authenticator.verifyStaff, usersController.getUsers);

usersRouter
  .route('/:id')
  .get(authenticator.verifyAuth, authenticator.verifyStaff, usersController.getUserById)
  .patch(
    validator.validateUserUpdate,
    authenticator.verifyAuth,
    authenticator.verifyAdmin,
    usersController.update,
  )
  .delete(authenticator.verifyAuth, authenticator.verifyAdmin, usersController.delete);

export default usersRouter;
