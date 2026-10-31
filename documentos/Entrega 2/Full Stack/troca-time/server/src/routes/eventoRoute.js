import { Router } from 'express';
import * as eventoController from '../controllers/eventos/eventoController.js';

const router = Router();

router.get('/', eventoController.listarEventosController);

export default router;