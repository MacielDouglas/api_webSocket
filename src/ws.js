import { WebSocketServer } from "ws";
import mongoose from "mongoose";
import Card from "./models/Card.js";
import Address from "./models/Address.js";

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
    console.log("Monitorando mudanças na coleção Cards...");

    Card.watch().on("change", async () => {
      try {
        const cards = await Card.find({}).lean();

        const cardsWithAddresses = await Promise.all(
          cards.map(async (card) => {
            const addresses = await Address.find({
              _id: { $in: card.street || [] },
            }).lean();

            return {
              ...card,
              id: card._id.toString(),
              street: addresses.map((address) => ({
                ...address,
                id: address._id.toString(),
              })),
            };
          })
        );

        console.log("Mudança detectada");

        // Enviar somente se houver clientes conectados
        if (clients.size > 0) {
          const data = JSON.stringify(cardsWithAddresses);
          clients.forEach((client) => client.send(data));
        }
      } catch (error) {
        console.error("Erro ao processar mudança no banco:", error);
      }
    });
  });

  return wss;
};
