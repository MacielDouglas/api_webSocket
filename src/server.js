import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://direcciones.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor WebSocket e MongoDB ativo!");
});

app.get("/ping", (req, res) => {
  res.send("Servidor ativo!");
});

export default app;
