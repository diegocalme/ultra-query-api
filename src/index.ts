import { HTTP_PORT } from './config/globals';
import { router as apiRoute } from './routes/api';
import { sendResourceNotFoundError, sendInternalError } from './routes/errors';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';

const app = express();

app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', apiRoute);

app.use(sendResourceNotFoundError);
app.use(sendInternalError);

app.listen(HTTP_PORT);