import express from 'express';
import bodyParser from 'body-parser';
import swaggerUI from 'swagger-ui-express';
import cors from 'cors';
import swagger from './openapi.json';
import router from './routes/index';
import controllerResponse from './helpers/controllerResponse.js';

const app = express();
const port = process.env.PORT || 3000;
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.text());

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swagger));

app.use('/api/v1', router);

app.use((err, req, res, next) => {
  controllerResponse.errorResponse(res, 400, new Error('operation not permitted'));
});

app.get('/', (req, res) => res.status(200).send('Welcome to Banka API'));

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`SERVER IS LIVE ON PORT::${port}`);
});

export default app;
