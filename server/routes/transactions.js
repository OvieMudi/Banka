import express from 'express';
import transactionsController from '../controllers/transactionsController';
import authenticateReq from '../middleware/authVerify';

const transactionsRouter = express.Router();

transactionsRouter.route('/').get(transactionsController.getAll);

transactionsRouter
  .route('/:accountNumber/credit')
  .post(authenticateReq.verifyAuth, transactionsController.creditAccount);

export default transactionsRouter;
