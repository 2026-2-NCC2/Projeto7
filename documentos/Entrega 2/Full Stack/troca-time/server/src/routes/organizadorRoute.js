import { Router } from 'express';
import * as organizadorController from '../controllers/organizadores/organizadorController.js';
import { autenticar, autorizar } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(autenticar, autorizar('organizador'));

router.post('/', organizadorController.criarEventoController);
router.get('/eventos/:id/custos', organizadorController.listarCustosController);
router.post('/eventos/:id/vagas', organizadorController.criarVagaServicoController);
router.post('/eventos/:id/custos', organizadorController.criarCustoController);

export default router;
