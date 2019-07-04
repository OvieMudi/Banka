import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import router from './routes/index';
import controllerResponse from './helpers/controllerResponse';

const app = express();
const port = process.env.PORT || 3000;
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.text());

app.use('/api/v1', router);

app.get('/', (req, res) => res.status(200).send('Welcome to Banka API'));

app.use((err, req, res, next) => {
  controllerResponse.errorResponse(res, 500, err);
});

app.use((req, res, next) => {
  controllerResponse.errorResponse(res, 404, new Error(`${req.url} not found`));
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`SERVER IS LIVE ON PORT::${port}`);
});

export default app;
