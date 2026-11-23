import { Router } from 'express';
import * as conversaController from '../controllers/conversas/conversaController.js';
import { autenticar, autorizar } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(autenticar, autorizar('organizador', 'fornecedor'));

router.get('/', conversaController.listarConversasController);
router.get('/:propostaId/mensagens', conversaController.listarMensagensController);
router.post('/:propostaId/mensagens', conversaController.enviarMensagemController);

export default router;
