import http from "http";

export const startKeepAlive = () => {
  setInterval(() => {
    const options = {
      hostname: "localhost",
      port: process.env.PORT || 4000,
      path: "/ping",
      method: "GET",
    };

    const req = http.request(options, (res) => {
      res.on("data", () => {});
    });

    req.on("error", (error) => {
      console.error("Erro ao manter o servidor ativo:", error);
    });

    req.end();
  }, 13 * 60 * 1000); // 13 minutos
};
