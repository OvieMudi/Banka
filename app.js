import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.text());

app.get('/', (req, res) => res.status(200).send('Welcome to Banka API'));

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`SERVER IS LIVE ON PORT::${port}`);
});
