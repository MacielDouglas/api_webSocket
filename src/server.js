import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor WebSocket e MongoDB ativo!");
});

app.get("/ping", (req, res) => {
  res.send("Servidor ativo!");
});

export default app;
