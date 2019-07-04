import express from 'express';
import accountsController from '../controllers/accountsController';
import transactionsController from '../controllers/transactionsController';
import auth from '../middleware/authenticator';
import validator from '../middleware/requestValidator';

const userAccountsRouter = express.Router();
userAccountsRouter
  .route('/:userEmail/accounts')
  .get(
    validator.validateEmailParams,
    auth.verifyAuth,
    auth.verifyEmailOwner,
    accountsController.getAllByEmail,
  );

userAccountsRouter
  .route('/:userEmail/transactions')
  .get(
    validator.validateEmailParams,
    auth.verifyAuth,
    auth.verifyEmailOwner,
    transactionsController.getByAllByEmail,
  );

export default userAccountsRouter;
