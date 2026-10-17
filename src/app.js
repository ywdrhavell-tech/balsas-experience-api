import express from "express";
import cors from "cors";
import atracoesRouter from "./routes/atracoes.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.status(200).json({
  nome: "Balsas Experience API",
  descricao: "API de informações turísticas de Balsas-MA",
  versao: "1.0.0",
  endpoints: { health: "/health", atracoes: "/atracoes" }
}));
app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));
app.use("/atracoes", atracoesRouter);

app.use((req, res) => res.status(404).json({ erro: "Rota não encontrada" }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ erro: err.message || "Erro interno do servidor" });
});

export default app;
