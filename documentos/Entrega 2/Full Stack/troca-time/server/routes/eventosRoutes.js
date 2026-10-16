
import { Router } from "express";
import * as eventosController from "../controllers/eventos/eventosController.js";

const router = Router();

router.get("/", eventosController.listarEventos);

export default router;
