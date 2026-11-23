import { Router } from 'express';
import * as admController from '../controllers/adm/admController.js';
import { autenticar, autorizar } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(autenticar, autorizar('adm'));

router.get('/resumo', admController.buscarResumoPlataformaController);
router.get('/organizadores/:id', admController.buscarDetalheOrganizadorController);
router.patch('/:id', admController.atualizarStatusCadastroController);

export default router;
