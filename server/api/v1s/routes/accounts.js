import express from 'express';
import accountsController from '../controllers/accountsController';
import authenticateReq from '../../middleware/authVerify';

const accountsRouter = express.Router();

accountsRouter
  .route('/')
  .post(authenticateReq.verifyAuth, accountsController.create)
  .get(accountsController.getAll);

export default accountsRouter;
