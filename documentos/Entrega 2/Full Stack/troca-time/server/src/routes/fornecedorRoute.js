import { Router } from 'express';
import * as fornecedorController from '../controllers/fornecedores/fornecedorController.js';
import { autenticar, autorizar } from '../middlewares/authMiddleware.js';

const router = Router();

router.get(
    '/:id', fornecedorController.buscarDetalhesFornecedorController,
    autenticar,
    autorizar('adm', 'forncedor', 'organizador')
);

export default router;
