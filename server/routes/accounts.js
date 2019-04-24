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
  .get(auth.verifyAuth, auth.verifyStaff, accountsController.getByAccountNumber)
  .patch(
    auth.verifyAuth,
    auth.verifyAdmin,
    validator.validateAccountUpdate,
    accountsController.updateAccount,
  )
  .delete(auth.verifyAuth, auth.verifyAdmin, accountsController.delete);

accountsRouter
  .route('/:accountNumber/transactions')
  .get(auth.verifyAuth, auth.verifyAccountOwner, accountsController.getAccountHistory);

export default accountsRouter;
