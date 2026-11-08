import { Router } from 'express';
import * as organizadorController from '../controllers/organizadores/organizadorController.js';
import { autenticar, autorizar } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(autenticar, autorizar('organizador'));

router.post('/', organizadorController.criarEventoController);


export default router;