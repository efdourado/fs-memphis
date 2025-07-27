import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api.js';
import staticRouter from './routes/static.js';
import errorHandler from './middlewares/errorHandlerMiddleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);
app.use(staticRouter);

app.use(errorHandler);

export default app;