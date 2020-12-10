import { HTTP_PORT } from './config/globals';
import { router as apiRoute } from './routes/api';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).jsonp({
    success: true,
    message: 'hello!'
  }).end();
});

app.use('/api', apiRoute);

app.listen(HTTP_PORT);