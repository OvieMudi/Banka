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
  .get(auth.verifyAuth, auth.verifyStaff, accountsController.getAll);

accountsRouter
  .route('/:accountNumber')
  .get(
    validator.validateAccountParams,
    auth.verifyAuth,
    auth.verifyAccountOwner,
    accountsController.getByAccountNumber,
  )
  .patch(
    validator.validateAccountParams,
    auth.verifyAuth,
    auth.verifyStaff,
    validator.validateAccountUpdate,
    accountsController.updateAccount,
  )
  .delete(
    validator.validateAccountParams,
    auth.verifyAuth,
    auth.verifyStaff,
    accountsController.delete,
  );

accountsRouter
  .route('/:accountNumber/transactions')
  .get(
    validator.validateAccountParams,
    auth.verifyAuth,
    auth.verifyAccountOwner,
    accountsController.getAccountHistory,
  );

export default accountsRouter;
