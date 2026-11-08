import { Router } from 'express';
import * as fornecedorController from '../controllers/fornecedores/fornecedorController.js';
import { autenticar, autorizar } from '../middlewares/authMiddleware.js';

const router = Router();

router.get(
    '/:id',
    autenticar,
    autorizar('adm', 'fornecedor', 'organizador'),
    fornecedorController.buscarDetalhesFornecedorController
);

router.post('/', fornecedorController.criarPropostaController);

router.use(autenticar, autorizar ('fornecedor'));

export default router;