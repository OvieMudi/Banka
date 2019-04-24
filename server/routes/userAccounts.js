import express from 'express';
import accountsController from '../controllers/accountsController';
import auth from '../middleware/authenticator';

const userAccountsRouter = express.Router();
userAccountsRouter
  .route('/:userEmail/accounts')
  .get(auth.verifyAuth, auth.verifyStaff, accountsController.getAllByEmail);

export default userAccountsRouter;
