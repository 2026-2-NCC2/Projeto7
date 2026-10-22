import express from 'express';
import eventoRoute from './src/routes/eventoRoute.js';

const app = express();

// Rotas
app.use('/eventos', eventoRoute);

export default app;