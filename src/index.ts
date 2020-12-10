import { HTTP_PORT } from './config/globals';
import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.status(200).jsonp({
    success: true,
    message: 'hello!'
  }).end();
});

app.listen(HTTP_PORT);