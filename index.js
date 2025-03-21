import http from "http";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import app from "./src/server.js";
import { setupWebSocket } from "./src/ws.js";
import "./src/models/Card.js";

dotenv.config();
const PORT = process.env.PORT || 4000;

// Conectar ao MongoDB
connectDB();

// Criar servidor HTTP
const server = http.createServer(app);

// Configurar WebSockets
setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
