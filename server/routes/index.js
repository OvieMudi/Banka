import express from 'express';
import authRouter from './auth';
import usersRouter from './users';
import accountsRouter from './accounts';
import transactionsRouter from './transactions';

const Router = express.Router();

Router.use('/auth', authRouter);
Router.use('/users', usersRouter);
Router.use('/accounts', accountsRouter);
Router.use('/transactions', transactionsRouter);

Router.get('/', (req, res) => res.json({
  status: 200,
  message: 'Welcome to Banka API',
}));

export default Router;
