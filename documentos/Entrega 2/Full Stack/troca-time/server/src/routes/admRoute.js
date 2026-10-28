import { Router } from 'express';
import * as admController from '../controllers/adm/admController.js';

const router = Router();

router.get('/resumo', admController.buscarResumoPlataformaController);
router.get('/usuarios', admController.listarUsuariosController);

export default router;
