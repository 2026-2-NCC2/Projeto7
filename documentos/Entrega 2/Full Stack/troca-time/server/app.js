import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger-output.json' with { type: 'json' };
import eventoRoute from './src/routes/eventoRoute.js';
import admRoute from './src/routes/admRoute.js';
import fornecedorRoute from './src/routes/fornecedorRoute.js';
import { errorMiddleware } from './src/middlewares/errorMiddleware.js';

const app = express();

app.use(express.json());

// Documentação
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Rotas
app.use('/eventos', eventoRoute);
app.use('/admin', admRoute);
app.use('/fornecedores', fornecedorRoute);

// Middlwares
app.use(errorMiddleware);

export default app;