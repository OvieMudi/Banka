import express from 'express';
import accountsController from '../controllers/accountsController';
import auth from '../middleware/authenticator';
import validator from '../middleware/requestValidator';

const accountsRouter = express.Router();

accountsRouter
  .route('/')
  .post(
    auth.verifyAuth,
    auth.verifyClient,
    validator.validateAccountCreate,
    accountsController.create,
  )
  .get(accountsController.getAll);
accountsRouter
  .route('/:accountNumber')
  .patch(
    auth.verifyAuth,
    auth.verifyAdmin,
    validator.validateAccountUpdate,
    accountsController.updateAccount,
  )
  .delete(auth.verifyAuth, auth.verifyAdmin, accountsController.delete);

export default accountsRouter;
