import { WebSocketServer } from "ws";
import mongoose from "mongoose";
import Card from "./models/Card.js";

const clients = new Set();

export const setupWebSocket = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("Novo cliente conectado!");
    clients.add(ws);

    ws.on("close", () => {
      console.log("Cliente desconectado.");
      clients.delete(ws);
    });
  });

  // Monitorar mudanças no MongoDB
  mongoose.connection.once("open", () => {
    console.log("Monitorando mudanças no banco de dados...");

    Card.watch().on("change", (change) => {
      console.log("Mudança detectada:", change);
      clients.forEach((client) => client.send(JSON.stringify(change)));
    });
  });

  return wss;
};
