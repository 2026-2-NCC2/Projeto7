import express from 'express';
import eventoRoute from './src/routes/eventoRoute.js';
import admRoute from './src/routes/admRoute.js';
import { errorMiddleware } from './src/middlewares/errorMiddleware.js';

const app = express();

app.use(express.json());

// Rotas
app.use('/eventos', eventoRoute);
app.use('/admin', admRoute);

// Middlwares
app.use(errorMiddleware);

export default app;