import express from 'express';
import eventoRoute from './src/routes/eventoRoute.js';
import admRoute from './src/routes/admRoute.js';

const app = express();

app.use(express.json());

// Rotas
app.use('/eventos', eventoRoute);
app.use('/admin', admRoute);

export default app;