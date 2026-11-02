import { Router } from 'express';
import * as authController from '../controllers/auth/authController.js';

const router = Router();

router.post('/cadastro', authController.cadastrarUsuarioController);

export default router;
