import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api.js';
import staticRouter from './routes/static.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);
app.use(staticRouter);

export default app;