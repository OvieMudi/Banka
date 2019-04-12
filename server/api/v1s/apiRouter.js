import express from 'express';
import authRouter from './routes/auth';
import usersRouter from './routes/users';

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);

apiRouter.get('/', (req, res) => res.json({
  status: 200,
  message: 'Welcome to Banka API',
}));

export default apiRouter;
