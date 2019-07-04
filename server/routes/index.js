import express from 'express';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import authRouter from './auth';
import usersRouter from './users';
import accountsRouter from './accounts';
import transactionsRouter from './transactions';
import userAccountsRouter from './userAccounts';

const Router = express.Router();

const swaggerDoc = YAML.load(`${__dirname}/../documentation/api_doc.yaml`);

Router.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
Router.use('/auth', authRouter);
Router.use('/users', usersRouter);
Router.use('/accounts', accountsRouter);
Router.use('/user', userAccountsRouter);
Router.use('/transactions', transactionsRouter);

Router.get('/', (req, res) => res.json({
  status: 200,
  message: 'Welcome to Banka API',
}));

export default Router;
