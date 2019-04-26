import express from 'express';
import accountsController from '../controllers/accountsController';
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

export default userAccountsRouter;
