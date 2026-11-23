import { Router } from 'express';
import * as usuarioController from '../controllers/usuarios/usuarioController.js';
import { autenticar, autorizar } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(autenticar, autorizar('adm', 'organizador'));

router.get('/', usuarioController.listarUsuariosController);

export default router;
