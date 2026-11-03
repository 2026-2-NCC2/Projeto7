import { Router } from 'express';
import * as eventoController from '../controllers/eventos/eventoController.js';
import { autenticar, autorizar } from '../middlewares/authMiddleware.js';

const router = Router();
router.use(autenticar, autorizar('adm', 'organizador', 'fornecedor'));

router.get('/', eventoController.listarEventosController);

export default router;