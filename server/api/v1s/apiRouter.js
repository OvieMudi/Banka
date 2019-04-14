import express from 'express';
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import accountsRouter from './routes/accounts';

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/accounts', accountsRouter);

apiRouter.get('/', (req, res) => res.json({
  status: 200,
  message: 'Welcome to Banka API',
}));

export default apiRouter;
