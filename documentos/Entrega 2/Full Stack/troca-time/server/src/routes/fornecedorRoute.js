import { Router } from 'express';
import * as fornecedorController from '../controllers/fornecedores/fornecedorController.js';

const router = Router();

router.get('/:id', fornecedorController.buscarDetalhesFornecedorController);

export default router;
