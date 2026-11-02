import express from 'express';
import eventoRoute from './src/routes/eventoRoute.js';
import admRoute from './src/routes/admRoute.js';
import fornecedorRoute from './src/routes/fornecedorRoute.js';
import authRoute from './src/routes/authRoute.js';
import { errorMiddleware } from './src/middlewares/errorMiddleware.js';

const app = express();

app.use(express.json());

// Documentação
// app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Rotas
app.use('/eventos', eventoRoute);
app.use('/admin', admRoute);
app.use('/fornecedores', fornecedorRoute);
app.use('/auth', authRoute);

// Middlwares
app.use(errorMiddleware);

export default app;