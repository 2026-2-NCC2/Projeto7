import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import eventoRoute from './src/routes/eventoRoute.js';
import admRoute from './src/routes/admRoute.js';
import fornecedorRoute from './src/routes/fornecedorRoute.js';
import authRoute from './src/routes/authRoute.js';
import organizadorRoute from './src/routes/organizadorRoute.js'
import usuarioRoute from './src/routes/usuarioRoute.js';
import { configs } from './src/configs/configs.js';

import { errorMiddleware } from './src/middlewares/errorMiddleware.js';

const app = express();

// Configurações
app.use(cors({
    origin: configs.client_url,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Documentação
// app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Rotas
app.use('/eventos', eventoRoute);
app.use('/admin', admRoute);
app.use('/fornecedores', fornecedorRoute);
app.use('/auth', authRoute);
app.use('/organizadores', organizadorRoute);
app.use('/usuarios', usuarioRoute);

// Middleware de tratamento de erros
app.use(errorMiddleware);

export default app;