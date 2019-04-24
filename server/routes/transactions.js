import express from 'express';
import transactionsController from '../controllers/transactionsController';
import auth from '../middleware/authenticator';
import validator from '../middleware/requestValidator';

const transactionsRouter = express.Router();

transactionsRouter.route('/').get(transactionsController.getAll);

transactionsRouter.route('/:transactionId').get(auth.verifyAuth, transactionsController.getById);

transactionsRouter
  .route('/:accountNumber/credit')
  .post(
    auth.verifyAuth,
    auth.verifyCashier,
    validator.validateTransaction,
    transactionsController.credit,
  );

transactionsRouter
  .route('/:accountNumber/debit')
  .post(
    auth.verifyAuth,
    auth.verifyCashier,
    validator.validateTransaction,
    transactionsController.debit,
  );

export default transactionsRouter;
