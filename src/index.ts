import { HTTP_PORT } from './config/globals';
import { router as apiRoute } from './routes/api';
import { getResourceNotFoundError, getInternalError } from './routes/errors';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';

const app = express();

app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', apiRoute);

app.use(getResourceNotFoundError);
app.use(getInternalError);

app.listen(HTTP_PORT);