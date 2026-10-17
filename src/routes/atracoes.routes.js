import { Router } from "express";
import * as controller from "../controllers/atracoes.controller.js";

const router = Router();
router.get("/", controller.listar);
router.get("/:id", controller.buscarPorId);
router.post("/", controller.criar);
router.put("/:id", controller.atualizar);
router.delete("/:id", controller.remover);
router.post("/:id/avaliacoes", controller.avaliar);
export default router;
