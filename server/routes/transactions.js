import express from 'express';
import transactionsController from '../controllers/transactionsController';
import auth from '../middleware/authenticator';
import validator from '../middleware/requestValidator';

const transactionsRouter = express.Router();

transactionsRouter.route('/').get(auth.verifyAuth, auth.verifyStaff, transactionsController.getAll);

transactionsRouter
  .route('/:transactionId')
  .get(validator.validateTrxParams, auth.verifyAuth, transactionsController.getById);

transactionsRouter
  .route('/:accountNumber/credit')
  .post(
    validator.validateAccountParams,
    auth.verifyAuth,
    auth.verifyCashier,
    validator.validateTransaction,
    transactionsController.credit,
  );

transactionsRouter
  .route('/:accountNumber/debit')
  .post(
    validator.validateAccountParams,
    auth.verifyAuth,
    auth.verifyCashier,
    validator.validateTransaction,
    transactionsController.debit,
  );

export default transactionsRouter;
