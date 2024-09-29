import { Router } from "express";
import { controller } from "../controllers/joyas.controller.js";

const router = Router();

router.get('/joyas', controller.obtenerJoyas)
router.get('/joyas/filtros', controller.obtenerJoyasPorFiltros)

export default router;
