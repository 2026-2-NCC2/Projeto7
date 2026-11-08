import { Router } from 'express';
import * as organizadorController from '../controllers/organizadores/organizadorController.js';
import { autenticar, autorizar } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(autenticar, autorizar('organizador'));

router.post('/', organizadorController.criarEventoController);
router.patch('/:id/status', organizadorController.atualizarStatusEventoController)
router.get('/vagas_servico/', organizadorController.listarVagasServicoController)
router.get('/:id/custos_manuais', organizadorController.listarCustosManuaisController)
router.post('/:id/vagas_servico', organizadorController.criarVagaServicoController)
router.post('/:id/custos_manuais', organizadorController.criarCustoManualController)
router.delete('/vagas_servico/:id', organizadorController.deletarVagaServicoController)
router.delete('/custos_manuais/:id', organizadorController.deletarCustoManualController)
router.get('/:id/propostas', organizadorController.listarPropostasEventoController)
router.get('/:id/custos_orcamento', organizadorController.listarCustosOrcamentoController)
router.patch('/propostas/:id/status', organizadorController.atualizarStatusPropostaController)

export default router;
