import { HTTP_PORT } from './config/globals';
import { createExpressRes } from './utils/createExpressRes';
import { router as apiRoute } from './routes/api';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';

const app = express();

app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).jsonp({
    success: true,
    message: 'hello!'
  }).end();
});

app.use('/api', apiRoute);

app.use((req, res) => {
  res.status(404).jsonp(createExpressRes(false, 404, { error: 'Resource not found' })).end();
});

app.listen(HTTP_PORT);